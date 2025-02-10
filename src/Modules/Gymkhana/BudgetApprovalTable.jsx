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
import { IconEye, IconEdit, IconSend } from "@tabler/icons-react";
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
} from "./BackendLogic/ApiRoutes";

import { BudgetApprovalForm } from "./BudgetForm";

function BudgetApprovals({ clubName }) {
  const user = useSelector((state) => state.user);
  const userRole = user.role;
  const token = localStorage.getItem("authToken");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [validationErrors] = useState({});
  const [commentValue, setCommentValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: commentsData, refetch: refetchComments } =
    useGetCommentsBudgetInfo(selectedBudget?.id, token);

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
    refetch: refetchBudget,
  } = useGetUpcomingBudgets(token); // Fetch budgets for the club (implement the API call)

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

  const updateBudgetMutation = useMutation({
    mutationFn: (updatedBudgetData) => {
      return axios.put(
        "http://127.0.0.1:8000/gymkhana/api/update_budget/",
        updatedBudgetData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      closeEditModal();
      refetchBudget();
      // You might want to refresh your events data here
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
      onSuccess: (response) => {
        console.log("Successfully comment posted!!!", response.data);
        setCommentValue(""); // Clear the comment input field
        refetchComments(); // Refresh the comments list
      },
      onError: (error) => {
        console.error("Error during posting comment", error);
        alert("Error during posting comment");
      },
    });
  };

  const approveFICMutation = useMutation({
    mutationFn: (budgetId) => approveFICBudgetButton(budgetId, token),
    onSuccess: () => {
      alert("Approved by FIC");
      closeViewModal();
      refetchBudget();
    },
  });

  const approveCounsellorMutation = useMutation({
    mutationFn: (budgetId) => approveCounsellorBudgetButton(budgetId, token),
    onSuccess: () => {
      alert("Approved by Counsellor");
      closeViewModal();
      refetchBudget();
    },
  });

  const approveDeanMutation = useMutation({
    mutationFn: (budgetId) => approveDeanBudgetButton(budgetId, token),
    onSuccess: () => {
      alert("Approved by Dean");
      closeViewModal();
      refetchBudget();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (budgetId) => rejectBudgetButton(budgetId, token),
    onSuccess: () => {
      alert("Rejected");
      closeViewModal();
      refetchBudget();
    },
  });

  const modifyMutation = useMutation({
    mutationFn: (budgetId) => modifyBudgetButton(budgetId, token),
    onSuccess: () => {
      closeViewModal();
      refetchBudget();
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
  const table = useMantineReactTable({
    columns,
    data: fetchedBudgets,
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
        <Pill
          bg={
            row.original.status === "ACCEPT"
              ? "#B9FBC0"
              : row.original.status === "REJECT"
                ? "#FFA8A5"
                : "#FFDB58"
          }
        >
          {row.original.status}
        </Pill>
      </Flex>
    ),
    state: {
      isLoading: isLoadingBudgets,
      showAlertBanner: isLoadingBudgetsError,
      showProgressBars: isFetchingBudgets,
    },
  });

  return (
    <>
      <MantineReactTable table={table} />
      {/* View Modal */}
      <Modal
        opened={!!selectedBudget && !isEditModalOpen}
        onClose={closeViewModal}
        w="40%"
      >
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
              <Stack>
                <Text
                  size="25px"
                  style={{ fontWeight: 900 }}
                  align="center"
                  mb="10px"
                >
                  {selectedBudget.budget_for}
                </Text>
                <Text size="15px" weight={700}>
                  <b>Amount Requested: </b> {selectedBudget.budget_amt}
                </Text>
                <Text size="15px" weight={700}>
                  <b>Description: </b>
                  {selectedBudget.description}
                </Text>
              </Stack>

              <Divider my="sm" />

              <Box>
                <Stack>
                  <Text size="md" weight={500}>
                    Comments:
                  </Text>
                  <ScrollArea
                    h={300}
                    styles={{
                      viewport: {
                        paddingRight: "10px", // Add padding to avoid overlap
                      },
                      scrollbar: {
                        position: "absolute",
                        right: 0,
                        width: "8px",
                      },
                    }}
                  >
                    {commentsData?.map((comment) => (
                      <Box
                        key={comment.event_index}
                        my="sm"
                        style={{
                          border: " solid 1px lightgray",
                          borderRadius: "5px",
                        }}
                      >
                        <Pill weight={900} size="xs" c="blue" mb="5px">
                          {comment.commentator_designation}
                        </Pill>
                        <Text size="sm" p="10px" radius="lg">
                          {comment.comment}{" "}
                        </Text>
                        <Group justify="end">
                          <Pill size="xs" mr="2px" mb="1px">
                            {comment.comment_date}, {comment.comment_time}
                          </Pill>
                        </Group>
                      </Box>
                    ))}
                  </ScrollArea>

                  <Group position="apart" align="center" w="100%">
                    <Flex align="center" gap="sm" style={{ flexGrow: 1 }}>
                      <Input
                        placeholder="Add a comment"
                        value={commentValue}
                        onChange={(event) =>
                          setCommentValue(event.currentTarget.value)
                        }
                        w="100%"
                        rightSection={
                          <CloseButton
                            aria-label="Clear input"
                            onClick={() => setCommentValue("")}
                            style={{
                              display: commentValue ? undefined : "none",
                            }}
                          />
                        }
                      />
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
                        <IconSend />
                      </Button>
                    </Flex>
                  </Group>
                </Stack>
              </Box>

              {(userRole === "FIC" ||
                userRole === "Dean_s" ||
                userRole === "Counsellor" ||
                userRole === "Professor") && (
                <Box mt="md">
                  <Group justify="center">
                    {(userRole === "FIC" || userRole === "Professor") && (
                      <Button
                        color="blue"
                        onClick={() => {
                          handleFICApproveButton(selectedBudget.id);
                        }}
                      >
                        FIC Approve
                      </Button>
                    )}
                    {userRole === "Dean_s" && (
                      <Button
                        color="blue"
                        onClick={() => {
                          handleDeanApproveButton(selectedBudget.id);
                        }}
                      >
                        Dean Approve
                      </Button>
                    )}
                    {userRole === "Counsellor" && (
                      <Button
                        color="blue"
                        onClick={() => {
                          handleCounsellorApproveButton(selectedBudget.id);
                        }}
                      >
                        Counsellor Approve
                      </Button>
                    )}
                    <Button
                      color="blue"
                      onClick={() => handleRejectButton(selectedBudget.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => handleModifyButton(selectedBudget.id)}
                    >
                      Modify
                    </Button>
                  </Group>
                </Box>
              )}
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
            }}
            onSubmit={(values) => {
              const formData = new FormData();

              // Add the text data (details)
              formData.append("budget_amt", values.budget_amt);

              // Add the ID of the event
              formData.append("id", selectedBudget.id);

              // Now, submit the formData to the backend using the mutation
              updateBudgetMutation.mutate(formData);
            }}
            editMode
            disabledFields={[
              "budget_for",
              "budget_file",
              "description",
              "status",
              "remarks",
            ]}
          />
        )}
      </Modal>
    </>
  );
}

BudgetApprovals.propTypes = {
  clubName: PropTypes.string,
};
function BudgetApprovalsWithProviders({ clubName }) {
  return <BudgetApprovals clubName={clubName} />;
}
BudgetApprovalsWithProviders.propTypes = {
  clubName: PropTypes.string,
};

export default BudgetApprovalsWithProviders;
