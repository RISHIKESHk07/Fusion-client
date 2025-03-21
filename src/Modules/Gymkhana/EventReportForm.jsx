import React, { useState } from "react";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import {
  TextInput,
  Button,
  Group,
  Container,
  Alert,
  Modal,
  FileInput,
} from "@mantine/core";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "./GymkhanaForms.css";
import { DateInput, TimeInput } from "@mantine/dates";

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

  const form = useForm({
    initialValues: initialValues || {
      event_name: "",
      venue: "",
      incharge: "",
      end_date: null,
      start_time: "",
      end_time: "",
      event_poster: "",
      special_announcement: "",
      club: clubName,
      start_date: null,
      description: "",
      event_budget: "",
    },
    validate: {
      event_name: (value) =>
        value.length < 2 ? "Title must have at least 2 letters" : null,
      venue: (value) => (value.length === 0 ? "Venue cannot be empty" : null),
      incharge: (value) =>
        value.length === 0 ? "Incharge cannot be empty" : null,
      end_date: (value) => (!value ? "End date cannot be empty" : null),
      start_time: (value) =>
        value.length === 0 ? "Start time cannot be empty" : null,
      end_time: (value) =>
        value.length === 0 ? "End time cannot be empty" : null,
      event_poster: (value) =>
        value.length === 0 ? "Event poster cannot be empty" : null,
      description: (value) =>
        value.length === 0 ? "Description cannot be empty" : null,
      start_date: (value) => (!value ? "Start date cannot be empty" : null),
      event_budget: (value) =>
        value.length === 0 ? "Event budget cannot be empty" : null,
    },
  });
  const mutation = useMutation({
    mutationFn: (newEventData) => {
      return axios.put(
        "http://127.0.0.1:8000/gymkhana/api/new_event/",
        newEventData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // For file uploads
            Authorization: `Token ${token}`,
          },
        },
      );
    },
    onSuccess: (response) => {
      console.log("Successfully requested:", response.data);
      setSuccessMessage("Event request forwarded successfully!");
      setIsModalOpen(true);
      form.reset();
    },
    onError: (error) => {
      console.error("Error during forwarding request:", error);
      setErrorMessage("Request failed. Please try again.");
    },
  });

  const handleSubmit = (values) => {
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

        <TextInput
          label="Event Name"
          placeholder="Enter event name"
          value={form.values.event_name}
          onChange={(event) =>
            form.setFieldValue("event_name", event.currentTarget.value)
          }
          error={form.errors.event_name}
          disabled={editMode && disabledFields.includes("event_name")}
          withAsterisk
        />
        <TextInput
          label="Description"
          placeholder="Enter the event description"
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue("description", event.currentTarget.value)
          }
          error={form.errors.description}
          disabled={editMode && disabledFields.includes("description")}
          withAsterisk
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
        <FileInput
          label="Event Poster"
          placeholder="Upload Event Poster"
          value={form.values.event_poster}
          onChange={(file) => form.setFieldValue("event_poster", file)}
          error={form.errors.event_poster}
          // disabled={editMode && disabledFields.includes("event_poster")}
          withAsterisk
          accept=".pdf"
        />
        <FileInput
          label="Event Budget"
          placeholder="Upload Event Budget"
          value={form.values.event_budget}
          onChange={(file) => form.setFieldValue("event_budget", file)}
          error={form.errors.event_budget}
          // disabled={editMode && disabledFields.includes("event_poster")}
          withAsterisk
          accept=".pdf"
        />
        <TextInput
          label="Special Announcement"
          placeholder="Enter the announcement"
          value={form.values.special_announcement}
          onChange={(event) =>
            form.setFieldValue(
              "special_announcement",
              event.currentTarget.special_announcement,
            )
          }
          error={form.errors.special_announcement}
          disabled={editMode && disabledFields.includes("special_announcement")}
          withAsterisk
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
  initialValues: PropTypes,
  onSubmit: PropTypes.func,
  editMode: PropTypes.bool,
  disabledFields: PropTypes.arrayOf(PropTypes.string),
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
