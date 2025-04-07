import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import {
  TextInput,
  Button,
  Group,
  Container,
  Alert,
  Modal,
  Select,
  NumberInput,
} from "@mantine/core";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "./GymkhanaForms.css";
import { DateInput, TimeInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { host, authRoute } from "../../routes/globalRoutes";
import { useGetNewsLetterEvent } from "./BackendLogic/ApiRoutes";

export const useCreateNewEvent = (
  token,
  setSuccessMessage,
  setErrorMessage,
  setIsModalOpen,
  form,
) => {
  return useMutation({
    mutationFn: (newEventData) => {
      const formData = new FormData();
      Object.keys(newEventData).forEach((key) => {
        if (newEventData[key] !== null && newEventData[key] !== undefined) {
          formData.append(key, newEventData[key]);
        }
      });

      return axios.post(`${host}/gymkhana/api/add_event_report/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
    },
    onSuccess: (response) => {
      console.log("Successfully created event:", response.data);
      setSuccessMessage("Event created successfully!");
      setIsModalOpen(true);
      form.reset();
    },
    onError: (submit_error) => {
      console.error("Error during event creation:", submit_error);
      setErrorMessage("Failed to create event. Please try again.");
    },
  });
};

function EventReportForm({
  clubName,
  initialValues,
  onSubmit,
  editMode = false,
  disabledFields = [],
}) {
  const token = localStorage.getItem("authToken");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchedEvents, setFetchedEvents] = useState(() => {
    const storedEvents = localStorage.getItem("fetchedEvents");
    return storedEvents ? JSON.parse(storedEvents) : null;
  });
  const [roll_no, setRollNo] = useState(() => localStorage.getItem("roll_no"));
  const navigate = useNavigate();
  const validateUser = useCallback(async () => {
    if (!token) {
      console.error("No authentication token found!");
      localStorage.removeItem("authToken");
      localStorage.removeItem("roll_no");
      notifications.show({
        title: "Authentication Error",
        message: "Token Invalid/Expired! Redirecting to login page.",
        color: "red",
      });
      return navigate("/accounts/login");
    }

    try {
      const { data } = await axios.get(authRoute, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!roll_no) {
        setRollNo(data.roll_no);
        localStorage.setItem("roll_no", data.roll_no); // Store globally
      }
    } catch (error) {
      console.error("User validation failed:", error);
      notifications.show({
        title: "Session Expired",
        message: "Your session has expired. Please log in again.",
        color: "red",
      });
    }
  }, []);

  useEffect(() => {
    validateUser();
  }, [validateUser]);

  const { data, error } = useGetNewsLetterEvent(roll_no, token);

  useEffect(() => {
    if (data && !fetchedEvents) {
      setFetchedEvents(data);
      localStorage.setItem("fetchedEvents", JSON.stringify(data));
    }
    if (error) {
      setErrorMessage("Failed to fetch events. Please try again.");
    }
  }, [data, error, fetchedEvents]);

  const form = useForm({
    initialValues: initialValues || {
      event: "",
      agenda: "", // Required
      participants: "", // Optional
      winners: "", // Optional
      gallery_assets: "", // Optional
      venue: "",
      incharge: "",
      start_date: null,
      end_date: null,
      start_time: "",
      end_time: "",
      event_budget: 0,
      club: clubName,
    },
    validate: {
      venue: (value) => (value.length === 0 ? "Venue cannot be empty" : null),
      incharge: (value) =>
        value.length === 0 ? "Incharge cannot be empty" : null,
      end_date: (value) => (!value ? "End date cannot be empty" : null),
      start_time: (value) =>
        value.length === 0 ? "Start time cannot be empty" : null,
      end_time: (value) =>
        value.length === 0 ? "End time cannot be empty" : null,
      agenda: (value) => (value.length === 0 ? "Agenda cannot be empty" : null),
      start_date: (value) => (!value ? "Start date cannot be empty" : null),
      event_budget: (value) =>
        value <= 0 ? "Budget must be a positive number" : null,
    },
  });

  const mutation = useCreateNewEvent(
    token,
    setSuccessMessage,
    setErrorMessage,
    setIsModalOpen,
    form,
  );

  const handleSubmit = async (values) => {
    console.log(values);
    if (editMode && onSubmit) {
      onSubmit(values);
      return;
    }

    const formattedValues = {
      ...values,
      start_date: values.start_date
        ? dayjs(values.start_date).format("YYYY-MM-DD")
        : null,
      end_date: values.end_date
        ? dayjs(values.end_date).format("YYYY-MM-DD")
        : null,
      event_budget: Number(values.event_budget),
      club: clubName,
    };

    mutation.mutate(formattedValues);
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)} className="club-form">
        <h2 className="club-header">Apply for {clubName}'s Event Report!</h2>
        {successMessage && (
          <Alert title="Success" color="green" mt="md" className="club-message">
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert title="Error" color="red" mt="md" className="club-message">
            {errorMessage}
          </Alert>
        )}

        <Select
          label="Event"
          placeholder="Enter event"
          value={form.values.event}
          data={
            fetchedEvents && Array.isArray(fetchedEvents)
              ? fetchedEvents.map((event) => ({
                  value: event.id.toString(),
                  label: event.event_name,
                }))
              : []
          } // Ensure default empty array
          onChange={(value) => form.setFieldValue("event", value)}
          disabled={editMode && disabledFields.includes("event")}
          withAsterisk
        />

        <TextInput
          label="Agenda"
          placeholder="Enter the agenda of the event"
          value={form.values.agenda}
          onChange={(event) =>
            form.setFieldValue("agenda", event.currentTarget.value)
          }
          error={form.errors.agenda}
          disabled={editMode && disabledFields.includes("agenda")}
          withAsterisk
        />

        <TextInput
          label="Participants"
          placeholder="Enter the participants (optional)"
          value={form.values.participants}
          onChange={(event) =>
            form.setFieldValue("participants", event.currentTarget.value)
          }
          disabled={editMode && disabledFields.includes("participants")}
        />

        <TextInput
          label="Winners"
          placeholder="Enter the winners (optional)"
          value={form.values.winners}
          onChange={(event) =>
            form.setFieldValue("winners", event.currentTarget.value)
          }
          disabled={editMode && disabledFields.includes("winners")}
        />

        <TextInput
          label="Gallery Assets"
          placeholder="Enter links to images/videos (optional)"
          value={form.values.gallery_assets}
          onChange={(event) =>
            form.setFieldValue("gallery_assets", event.currentTarget.value)
          }
          disabled={editMode && disabledFields.includes("gallery_assets")}
        />
        <TextInput
          label="Venue"
          placeholder="Enter the venue"
          value={form.values.venue}
          onChange={(event) =>
            form.setFieldValue("venue", event.currentTarget.value)
          }
          error={form.errors.venue}
          disabled={editMode && disabledFields.includes("venue")}
          withAsterisk
        />
        <TextInput
          label="Incharge"
          placeholder="Incharge"
          value={form.values.incharge}
          onChange={(event) =>
            form.setFieldValue("incharge", event.currentTarget.value)
          }
          error={form.errors.incharge}
          disabled={editMode && disabledFields.includes("incharge")}
          withAsterisk
        />

        <DateInput
          label="Start Date"
          valueFormat="YYYY-MM-DD"
          placeholder="Enter the start date (e.g., YYYY-MM-DD)"
          value={form.values.start_date}
          onChange={(event) => form.setFieldValue("start_date", event)}
          error={form.errors.start_date}
          disabled={editMode && disabledFields.includes("start_date")}
          withAsterisk
        />

        <DateInput
          label="End Date"
          valueFormat="YYYY-MM-DD"
          placeholder="Enter the end date (e.g., YYYY-MM-DD)"
          value={form.values.end_date}
          onChange={(event) => form.setFieldValue("end_date", event)}
          error={form.errors.end_date}
          disabled={editMode && disabledFields.includes("end_date")}
          withAsterisk
        />

        <TimeInput
          label="Start Time"
          placeholder="Enter start time of the event"
          value={form.values.start_time}
          onChange={(event) =>
            form.setFieldValue("start_time", event.currentTarget.value)
          }
          error={form.errors.start_time}
          disabled={editMode && disabledFields.includes("start_time")}
          withAsterisk
        />

        <TimeInput
          label="End Time"
          placeholder="Enter end time of the event"
          value={form.values.end_time}
          onChange={(event) =>
            form.setFieldValue("end_time", event.currentTarget.value)
          }
          error={form.errors.end_time}
          disabled={editMode && disabledFields.includes("end_time")}
          withAsterisk
        />
        <NumberInput
          label="Event Budget"
          placeholder="Enter Event Budget"
          value={form.values.event_budget}
          onChange={(value) => form.setFieldValue("event_budget", value)}
          error={form.errors.event_budget}
          disabled={editMode && disabledFields.includes("event_budget")}
          withAsterisk
          precision={2}
        />

        <TextInput label="Club Name" value={clubName} readOnly withAsterisk />

        <Group position="center" mt="md" className="submit-container">
          <Button type="submit" className="submit-btn">
            {editMode ? "Update" : "Submit"}
          </Button>
        </Group>
      </form>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Success!"
      >
        <p>
          Your event has been successfully {editMode ? "updated" : "submitted"}!
        </p>
        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
      </Modal>
    </Container>
  );
}

EventReportForm.propTypes = {
  clubName: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    event: PropTypes.string,
    agenda: PropTypes.string,
    participants: PropTypes.string,
    winners: PropTypes.string,
    gallery_assets: PropTypes.string,
    venue: PropTypes.string,
    incharge: PropTypes.string,
    start_date: PropTypes.instanceOf(Date),
    end_date: PropTypes.instanceOf(Date),
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    event_budget: PropTypes.number,
    club: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  editMode: PropTypes.bool,
  disabledFields: PropTypes.arrayOf(PropTypes.string),
};

EventReportForm.defaultProps = {
  initialValues: null,
  onSubmit: null,
  editMode: false,
  disabledFields: [],
};

function ReportForm({ clubName }) {
  return (
    <Container>
      <EventReportForm clubName={clubName} />
    </Container>
  );
}

ReportForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};

export { EventReportForm };
export default ReportForm;
