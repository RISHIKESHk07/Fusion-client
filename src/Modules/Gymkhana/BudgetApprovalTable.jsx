
import React, { useMemo, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  ActionIcon,
  Flex,
  Stack,
  Text,
  Input,
  Tooltip,
  Modal,
  Box,
  Button,
  CloseButton,
  Group,
  Divider,
  ScrollArea,
  Pill,
} from "@mantine/core";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  useGetUpcomingBudgets,
  useGetCommentsBudgetInfo,
  approveFICBudgetButton,
  approveCounsellorBudgetButton,
  approveDeanBudgetButton,
  rejectBudgetButton,
  modifyBudgetButton,
} from "./BackendLogic/ApiRoutes"; // adjust the import path

import { BudgetApprovalForm } from "./BudgetForm";

function BudgetApprovals({ clubName }) {
  const token = localStorage.getItem("authToken");
  const user = useSelector((state) => state.user);
  const userRole = user.role;
  const [validationErrors] = useState({});
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [commentValue, setCommentValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: commentsData } = useGetCommentsBudgetInfo(
    selectedBudget?.id,
    token,
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "budget_for",
        header: "Budget Title",
      },
      {
        accessorKey: "budget_amt",
        header: "Amount",
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
      },
    ],
    [validationErrors],
  );

  const {
    data: fetchedBudgets = [],
    isError: isLoadingBudgetsError,
    isFetching: isFetchingBudgets,
    isLoading: isLoadingBudgets,
  } = useGetUpcomingBudgets(token); // Fetch budgets for the club (implement the API call)

  const filteredBudgets = useMemo(() => {
    return fetchedBudgets.filter((budget) => {
      if ((budget.status.toLowerCase() === "coordinator" ||budget.status.toLowerCase()==="reject" ) && userRole.toLowerCase() === "co-ordinator") {
        return true;
      }
      if (budget.status.toLowerCase() === "fic") {
        if (userRole.toLowerCase() === "co-ordinator" || userRole.toLowerCase() === "professor" || userRole.toLowerCase() === "assistant professor") {
          return true;
        }
      }
      if (budget.status.toLowerCase() === "counsellor") {
        if (userRole.toLowerCase() === "counsellor" || userRole.toLowerCase() === "professor" || userRole.toLowerCase() === "assistant professor" || userRole.toLowerCase() === "co-ordinator") {
          return true;
        }
      }
      if (budget.status.toLowerCase() === "dean" ||budget.status.toLowerCase()==="accept") {
        if (userRole.toLowerCase() === "dean_s" || userRole.toLowerCase() === "counsellor" || userRole.toLowerCase() === "professor" || userRole.toLowerCase() === "assistant professor" || userRole.toLowerCase() === "co-ordinator") {
          return true;
        }
      }
      return false;
    });
  }, [fetchedBudgets, userRole]);

  const openViewModal = (budget) => {
    setSelectedBudget(budget);
  };

  const closeViewModal = () => {
    setSelectedBudget(null);
  };

  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBudget(null);
  };

  const renderRoleBasedActions = useMemo(() => {
    if (!selectedBudget) return null;

    if (selectedBudget.status === 'FIC' && (userRole === 'Professor' || userRole === 'Assistant Professor')) {
      return (
        <>
          <Button color='blue' onClick={() => handleFICApproveButton(selectedBudget.id)}>FIC Approve</Button>
          <Button color="red" onClick={() => handleRejectButton(selectedBudget.id)}>Reject</Button>
          <Button color="yellow" onClick={() => handleModifyButton(selectedBudget.id)}>Modify</Button>
        </>
      );
    } else if (selectedBudget.status === 'COUNSELLOR' && userRole === 'Counsellor') {
      return (
        <>
          <Button color='blue'  onClick={() => handleCounsellorApproveButton(selectedBudget.id)}>Counsellor Approve</Button>
          <Button color="red" onClick={() => handleRejectButton(selectedBudget.id)}>Reject</Button>
          <Button color="yellow" onClick={() => handleModifyButton(selectedBudget.id)}>Modify</Button>
        </>
      );
    } else if (selectedBudget.status === 'DEAN' && userRole === 'Dean_s') {
      return (
        <>
          <Button color='blue' onClick={() =>handleDeanApproveButton(selectedBudget.id)}>Final Approve</Button>
          <Button color="red" onClick={() => handleRejectButton(selectedBudget.id)}>Reject</Button>
        </>
      );
    }

    return null;
  }, [selectedBudget, userRole]);

  const updateBudgetMutation = useMutation({
    mutationFn: (updatedEventData) => {
      return axios.put(
        "http://127.0.0.1:8000/gymkhana/api/update_budget/",
        updatedEventData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      closeEditModal();
      // You might want to refresh your events data here
    },
  });

  const table = useMantineReactTable({
    columns,
    data: filteredBudgets,
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingBudgetsError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    renderRowActions: ({ row }) => (
      <Flex gap="md">
        <Tooltip label="View">
          <ActionIcon onClick={() => openViewModal(row.original)}>
            <IconEye />
          </ActionIcon>
        </Tooltip>

        <Pill
          bg={
            row.original.status === "ACCEPT"
              ? "green"
              : row.original.status === "REJECT"
                ? "red"
                : "yellow"
          }
        >
          {row.original.status}
        </Pill>

        {row.original.status === "COORDINATOR" &&
          userRole === "co-ordinator" && (
            <Tooltip label="Edit">
              <ActionIcon
                color="blue"
                onClick={() => openEditModal(row.original)}
              >
                <IconEdit />
              </ActionIcon>
            </Tooltip>
          )}
      </Flex>
    ),
    state: {
      isLoading: isLoadingBudgets,
      showAlertBanner: isLoadingBudgetsError,
      showProgressBars: isFetchingBudgets,
    },
  });

  const mutation = useMutation({
    mutationFn: (commentData) => {
      return axios.post(
        "http://localhost:8000/gymkhana/api/create_budget_comment/",
        {
          budget_id: commentData.selectedBudget.id,
          commentator_designation: commentData.userRole,
          comment: commentData.commentValue,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    },
  });

  const handleCommentSubmit = (values) => {
    mutation.mutate(values, {
      onSuccess: () => {
        alert("Comment posted successfully!");
      },
      onError: () => {
        alert("Error posting comment");
      },
    });
  };

  const approveFICMutation = useMutation({
    mutationFn: (budgetId) => approveFICBudgetButton(budgetId, token),
    onSuccess: () => {
      alert("Approved by FIC");
      closeViewModal();
    },
  });

  const approveCounsellorMutation = useMutation({
    mutationFn: (budgetId) => approveCounsellorBudgetButton(budgetId, token),
    onSuccess: () => {
      alert("Approved by Counsellor");
      closeViewModal();
    },
  });

  const approveDeanMutation = useMutation({
    mutationFn: (budgetId) => approveDeanBudgetButton(budgetId, token),
    onSuccess: () => {
      alert("Approved by Dean");
      closeViewModal();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (budgetId) => rejectBudgetButton(budgetId, token),
    onSuccess: () => {
      alert("Rejected");
      closeViewModal();
    },
  });

  const modifyMutation = useMutation({
    mutationFn: (budgetId) => modifyBudgetButton(budgetId, token),
    onSuccess: () => {
      closeViewModal();
    },
  });

  const handleFICApproveButton = (budgetId) => {
    approveFICMutation.mutate(budgetId);
  };
  const handleCounsellorApproveButton = (budgetId) => {
    approveCounsellorMutation.mutate(budgetId);
  };
  const handleDeanApproveButton = (budgetId) => {
    approveDeanMutation.mutate(budgetId);
  };

  const handleRejectButton = (budgetId) => {
    rejectMutation.mutate(budgetId);
  };
  const handleModifyButton = (budgetId) => {
    modifyMutation.mutate(budgetId);
  };

  return (
    <>
      <MantineReactTable table={table} />
      <Modal opened={!!selectedBudget} onClose={closeViewModal} w="40%">
        {selectedBudget && (
          <Stack
            spacing="md"
            sx={{
              width: "40%",
              padding: "20px",
              border: "1px solid #dfe1e5",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
            }}
          >
            <Box>
              <Stack spacing="xs">
                <Text
                  size="lg"
                  style={{ fontWeight: 900 }}
                  align="center"
                  mb="xs"
                >
                  {selectedBudget.budget_for}
                </Text>
                <Text size="sm" weight={700}>
                  <span style={{ fontWeight: 900, fontSize: "16px" }}>
                    Amount Requested:
                  </span>{" "}
                  {selectedBudget.budget_amt}
                </Text>
                <Text size="sm" weight={700}>
                  <span style={{ fontWeight: 900, fontSize: "16px" }}>
                    Description:
                  </span>{" "}
                  {selectedBudget.description}
                </Text>
              </Stack>

              <Divider my="sm" />

              <Box>
                <Stack>
                  <Text size="md" weight={700}>
                    Comments:
                  </Text>
                  <ScrollArea h={250}>
                    {commentsData?.map((comment) => (
                      <Box
                        key={comment.event_index}
                        my="sm"
                        style={{
                          border: "solid 2px black",
                          borderRadius: "5px",
                          padding: "2px",
                        }}
                      >
                        <Pill weight={900} size="md" c="blue" mb="5px">
                          {comment.commentator_designation}
                        </Pill>
                        <Text size="sm" p="2px" radius="lg">
                          {comment.comment}{" "}
                        </Text>
                        <Group justify="end">
                          <Pill>{comment.comment_date}</Pill>
                          <Pill>{comment.comment_time}</Pill>
                        </Group>
                      </Box>
                    ))}
                  </ScrollArea>


                  <Group position="apart" align="center">
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Input
                          placeholder="Add a comment"
                          value={commentValue}
                          
                          onChange={(budget) => setCommentValue(budget.currentTarget.value)}
                          style={{ paddingRight: '30px' , width : '290px'}} // Add padding to make space for the CloseButton
                        />
                        {commentValue && (
                          <CloseButton
                            aria-label="Clear input"
                            onClick={() => setCommentValue("")}
                            style={{
                              position: 'absolute',
                              right: '5px',
                              cursor: 'pointer',
                            }}
                          />
                        )}
                      </div>
                    <Button
                      onClick={() => {
                        const objectComment = {
                          userRole,
                          commentValue,
                          selectedBudget,
                        };
                        handleCommentSubmit(objectComment);
                      }}
                      color="blue"
                    >
                      Submit
                    </Button>

                    {renderRoleBasedActions}

                  </Group>
                </Stack>

              </Box>

              
            </Box>
          </Stack>
        )}
      </Modal>

        {/* Edit Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Budget"
        size="lg"
      >
        {selectedBudget && (
          <BudgetApprovalForm
            clubName={clubName}
            initialValues={{
              ...selectedBudget,
              budget_for: selectedBudget.budget_for,
              description: selectedBudget.description,
            }}
            onSubmit={(values) => {
              const formData = new FormData();

              // Add the text data (description)
              formData.append("budget_amt", values.budget_amt);
              
              if (values.budget_file) {
                formData.append("budget_file", values.budget_file);
              }

              formData.append("remarks", values.remarks);
              // Add the ID of the budget
              formData.append("id", selectedBudget.id);

              // Now, submit the formData to the backend using the mutation
              updateBudgetMutation.mutate(formData);
            }}
            editMode
            disabledFields={[
              "budget_for",
              "description",
              "status",
            ]}
          />
        )}
      </Modal>

    </>
  );
}

function BudgetApprovalsWithProviders({ clubName }) {
  return <BudgetApprovals clubName={clubName} />;
}
BudgetApprovalsWithProviders.propTypes = {
  clubName: PropTypes.string,
};
BudgetApprovals.propTypes = {
  clubName: PropTypes.string,
};

export default BudgetApprovalsWithProviders;