import React, { useState, useEffect, useRef } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Container,
  Alert,
  Modal,
  FileInput,
  Select,
} from "@mantine/core";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import "./GymkhanaForms.css";
import axios from "axios";
import { useGetNewsLetterEvent } from "./BackendLogic/ApiRoutes";

function NewsForm({
  initialValues,
  onSubmit,
  editMode = false,
  disabledFields = [],
  clubName,
}) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("authToken");
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const roll_no = "21BCS158";

  const { data, error } = useGetNewsLetterEvent(roll_no, token);

  const isFetched = useRef(false);
  useEffect(() => {
    if (data && !isFetched.current) {
      setFetchedEvents(data);
      isFetched.current = true;
    }
    if (error) {
      setErrorMessage("Failed to fetch events. Please try again.");
    }
  }, [data, error]);

  const form = useForm({
    initialValues: initialValues || {
      event: "",
      description: "",
      images: null,
    },
    validate: {
      // event: (value) =>
      //   value.length < 2 ? "Title must have at least 2 letters" : null,
      description: (value) =>
        value.length === 0 ? "Details cannot be empty" : null,
      images: (value) => (!value ? "You must attach a file" : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (newEventData) => {
      return axios.post(
        "http://127.0.0.1:8000/gymkhana/api/coordinator_eventsinput/", // Adjust API URL as needed
        newEventData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
            Authorization: `Token ${token}`, // Ensure token is present
          },
        },
      );
    },
    onSuccess: (response) => {
      console.log("Successfully submitted event:", response.data);
      setSuccessMessage("Event submitted successfully!");
      setIsModalOpen(true);
      form.reset();
    },
    onError: (submit_error) => {
      console.error("Error during event submission:", submit_error);
      setErrorMessage("Event submission failed. Please try again.");
    },
  });

  const handleSubmit = async (values) => {
    if (editMode && onSubmit) {
      onSubmit(values);
      return;
    }

    const formattedValues = {
      ...values,
    };
    console.log(formattedValues);
    mutation.mutate(formattedValues);
    console.log(form);
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)} className="club-form">
        {successMessage && (
          <Alert title="Success" color="green" mt="md">
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert title="Error" color="red" mt="md">
            {errorMessage}
          </Alert>
        )}
        <h2 className="club-header">Newsletter for {clubName}'s Event!</h2>
        <Select
          label="Event Name"
          placeholder="Enter event name"
          value={form.values.event.id}
          data={fetchedEvents.map((event) => ({
            value: JSON.stringify(event.id), // Assuming event has a `event_name` property
            label: event.event_name,
          }))}
          onChange={(value) => form.setFieldValue("event", value)} // Directly access the value
          error={form.errors.event}
          disabled={editMode && disabledFields.includes("event")}
          withAsterisk
        />

        <TextInput
          label="Details"
          placeholder="Enter the event details"
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue("description", event.currentTarget.value)
          }
          error={form.errors.description}
          disabled={editMode && disabledFields.includes("description")}
          withAsterisk
        />

        <FileInput
          label="Event Poster"
          placeholder="Upload Event Poster"
          value={form.values.images}
          onChange={(file) => form.setFieldValue("images", file)}
          error={form.errors.images}
          disabled={editMode && disabledFields.includes("images")}
          withAsterisk
        />

        <Group position="center" mt="md">
          <Button type="submit" className="submit-btn" onSubmit={handleSubmit}>
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

NewsForm.propTypes = {
  initialValues: PropTypes,
  onSubmit: PropTypes.func,
  editMode: PropTypes.bool,
  disabledFields: PropTypes.arrayOf(PropTypes.string),
  clubName: PropTypes.string.isRequired,
};

function EventForm({ clubName }) {
  return (
    <Container>
      <NewsForm clubName={clubName} />
    </Container>
  );
}

EventForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};

export { NewsForm };
export default EventForm;
