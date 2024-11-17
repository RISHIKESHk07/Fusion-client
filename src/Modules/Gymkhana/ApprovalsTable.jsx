import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
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
  Pill,
  ScrollArea,
} from "@mantine/core";
import { IconEye, IconEdit, IconSend } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  rejectEventButton,
  modifyEventButton,
  useGetUpcomingEvents,
  useGetCommentsEventInfo,
  approveFICEventButton,
  approveCounsellorEventButton,
  approveDeanEventButton,
} from "./BackendLogic/ApiRoutes";

import { EventsApprovalForm } from "./EventForm";

function EventApprovals({ clubName }) {
  const user = useSelector((state) => state.user);
  const userRole = user.role;
  const token = localStorage.getItem("authToken");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [validationErrors] = useState({});
  const [commentValue, setCommentValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: commentsData, refetch: refetchComments } =
    useGetCommentsEventInfo(selectedEvent?.id, token);

  const columns = useMemo(
    () => [
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "event_name",
        header: "Event Title",
      },
      {
        accessorKey: "start_date",
        header: "Date",
      },
    ],
    [validationErrors],
  );

  const {
    data: fetchedEvents = [],
    isError: isLoadingEventsError,
    isFetching: isFetchingEvents,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useGetUpcomingEvents(token);

  const openViewModal = (event) => {
    setSelectedEvent(event);
  };

  const closeViewModal = () => {
    setSelectedEvent(null);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const updateEventMutation = useMutation({
    mutationFn: (updatedEventData) => {
      return axios.put(
        "http://127.0.0.1:8000/gymkhana/api/update_event/",
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
      refetchEvents();
      // You might want to refresh your events data here
    },
  });

  const mutation = useMutation({
    mutationFn: (commentData) => {
      return axios.post(
        "http://localhost:8000/gymkhana/api/create_event_comment/",
        {
          event_id: commentData.selectedEvent.id,
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
        // alert("Successfully comment posted!!!");
      },
      onError: (error) => {
        console.error("Error during posting comment", error);
        alert("Error during posting comment");
      },
    });
  };

  const approveFICMutation = useMutation({
    mutationFn: (eventId) => {
      approveFICEventButton(eventId, token);
    },
    onSuccess: () => {
      alert("Approved by FIC");
      closeViewModal();
      refetchEvents();
    },
  });

  const approveCounsellorMutation = useMutation({
    mutationFn: (eventId) => approveCounsellorEventButton(eventId, token),
    onSuccess: () => {
      alert("Approved by Counsellor");
      closeViewModal();
      refetchEvents();
    },
  });

  const approveDeanMutation = useMutation({
    mutationFn: (eventId) => approveDeanEventButton(eventId, token),
    onSuccess: () => {
      alert("Approved by Dean Student");
      closeViewModal();
      refetchEvents();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (eventId) => rejectEventButton(eventId, token),
    onSuccess: () => {
      alert("Rejected the event");
      closeViewModal();
      refetchEvents();
    },
  });

  const modifyMutation = useMutation({
    mutationFn: (eventId) => modifyEventButton(eventId, token),
    onSuccess: () => {
      closeViewModal();
      refetchEvents();
    },
  });

  const handleFICApproveButton = (eventId) => {
    approveFICMutation.mutate(eventId);
  };

  const handleCounsellorApproveButton = (eventId) => {
    approveCounsellorMutation.mutate(eventId);
  };
  const handleDeanApproveButton = (eventId) => {
    approveDeanMutation.mutate(eventId);
  };

  const handleRejectButton = (eventId) => {
    rejectMutation.mutate(eventId);
  };

  const handleModifyButton = (eventId) => {
    modifyMutation.mutate(eventId);
  };

  const table = useMantineReactTable({
    columns,
    data: fetchedEvents,
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingEventsError
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
      isLoading: isLoadingEvents,
      showAlertBanner: isLoadingEventsError,
      showProgressBars: isFetchingEvents,
    },
  });

  return (
    <>
      <MantineReactTable table={table} />

      {/* View Modal */}
      <Modal
        opened={!!selectedEvent && !isEditModalOpen}
        onClose={closeViewModal}
        w="40%"
      >
        {selectedEvent && (
          <Stack
            spacing="md"
            sx={{
              width: "100%",
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
                  {selectedEvent.event_name}
                </Text>
                <Text size="15px" weight={700}>
                  <b>Date:</b> {selectedEvent.start_date} to{" "}
                  {selectedEvent.end_date}
                </Text>
                <Text size="15px" weight={700}>
                  <b>Time:</b> {selectedEvent.start_time} to{" "}
                  {selectedEvent.end_time}
                </Text>
                <Text size="15px" weight={700}>
                  <b>Venue: </b>
                  {selectedEvent.venue}
                </Text>
                <Text size="15px" weight={700}>
                  <b>Description: </b> {selectedEvent.details}
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
                        key={comment.comment}
                        my="sm"
                        style={{
                          border: " solid 1px lightgray",
                          borderRadius: "5px",
                        }}
                      >
                        <Pill weight={900} size="xs" c="blue" ml="5px">
                          {comment.commentator_designation}
                        </Pill>
                        <Text size="sm" pl="10px" radius="lg">
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
                        w="100%" // Takes full width of the parent container
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
                            selectedEvent,
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
                          handleFICApproveButton(selectedEvent.id);
                        }}
                      >
                        FIC Approve
                      </Button>
                    )}

                    {userRole === "Dean_s" && (
                      <Button
                        color="blue"
                        onClick={() => {
                          handleDeanApproveButton(selectedEvent.id);
                        }}
                      >
                        Dean Approve
                      </Button>
                    )}
                    {userRole === "Counsellor" && (
                      <Button
                        color="blue"
                        onClick={() => {
                          handleCounsellorApproveButton(selectedEvent.id);
                        }}
                      >
                        Counsellor Approve
                      </Button>
                    )}
                    <Button
                      color="blue"
                      onClick={() => {
                        handleRejectButton(selectedEvent.id);
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => {
                        handleModifyButton(selectedEvent.id);
                      }}
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
        title="Edit Event"
        size="lg"
      >
        {selectedEvent && (
          <EventsApprovalForm
            clubName={clubName}
            initialValues={{
              ...selectedEvent,
              start_date: new Date(selectedEvent.start_date),
              end_date: new Date(selectedEvent.end_date),
              start_time: selectedEvent.start_time,
              end_time: selectedEvent.end_time,
            }}
            onSubmit={(values) => {
              const formData = new FormData();

              // Add the text data (details)
              formData.append("details", values.details);

              // Add the file (poster), check if a new file is selected
              if (values.poster) {
                formData.append("event_poster", values.poster);
              }

              // Add the ID of the event
              formData.append("id", selectedEvent.id);

              // Now, submit the formData to the backend using the mutation
              updateEventMutation.mutate(formData);
            }}
            editMode
            disabledFields={[
              "event_name",
              "venue",
              "incharge",
              "start_date",
              "end_date",
              "start_time",
              "end_time",
            ]}
          />
        )}
      </Modal>
    </>
  );
}

EventApprovals.propTypes = {
  clubName: PropTypes.string,
};

function EventApprovalsWithProviders({ clubName }) {
  return <EventApprovals clubName={clubName} />;
}

EventApprovalsWithProviders.propTypes = {
  clubName: PropTypes.string,
};

export default EventApprovalsWithProviders;
