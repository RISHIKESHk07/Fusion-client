import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Container,
  Alert,
  FileInput,
} from "@mantine/core";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "./GymkhanaForms.css";

const token = localStorage.getItem("authToken");

function BudgetApprovalForm({ clubName }) {
  console.log(clubName);

  // State for success and error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Set up the form with initial values and validation
  const form = useForm({
    initialValues: {
      budget_for: "",
      description: "",
      budget_file: null, // For the file upload
      budget_amt: "",
      status: "",
      remarks: "",
      club: clubName,
    },
    validate: {
      budget_for: (value) =>
        value.length === 0 ? "Budget for cannot be empty" : null,
      description: (value) =>
        value.length === 0 ? "Description cannot be empty" : null,
      budget_amt: (value) =>
        typeof value !== "number" || Number.isNaN(value) || value <= 0
          ? "Budget amount must be a positive number"
          : null,
      status: (value) => (value.length === 0 ? "Status cannot be empty" : null),
      remarks: (value) =>
        value.length === 0 ? "Remarks cannot be empty" : null,
      budget_file: (value) => (!value ? "You must attach a PDF" : null), // File validation
    },
  });

  // Mutation setup for submitting the form data via API
  const mutation = useMutation({
    mutationFn: (newBudgetData) => {
      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append("budget_for", newBudgetData.budget_for);
      formData.append("description", newBudgetData.description);
      formData.append("budget_amt", newBudgetData.budget_amt);
      formData.append("status", newBudgetData.status);
      formData.append("remarks", newBudgetData.remarks);
      formData.append("club", newBudgetData.club);
      formData.append("budget_file", newBudgetData.budget_file); // Attach the file

      return axios.put(
        "http://127.0.0.1:8000/gymkhana/api/new_budget/", // API URL for the budget submission
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // For file uploads
            Authorization: `Token ${token}`, // Auth token
          },
        },
      );
    },
    onSuccess: (response) => {
      console.log("Successfully submitted budget:", response.data);
      setSuccessMessage("Budget submission successful!");
      form.reset(); // Optionally reset the form after successful submission
    },
    onError: (error) => {
      console.error("Error during budget submission:", error);
      setErrorMessage("Budget submission failed. Please try again.");
    },
  });

  // Submit handler
  const handleSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)} className="club-form">
        <h2 className="club-header">{clubName}'s Budget Proposal</h2>
        {/* Success Message */}
        {successMessage && (
          <Alert title="Success" color="green" mt="md" className="club-message">
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert title="Error" color="red" mt="md" className="club-message">
            {errorMessage}
          </Alert>
        )}

        {/* Budget For */}
        <TextInput
          label="Budget For"
          placeholder="What is this budget for?"
          value={form.values.budget_for}
          onChange={(event) =>
            form.setFieldValue("budget_for", event.currentTarget.value)
          }
          error={form.errors.budget_for}
          withAsterisk
        />

        {/* Description */}
        <TextInput
          label="Description"
          placeholder="Enter the budget description"
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue("description", event.currentTarget.value)
          }
          error={form.errors.description}
          withAsterisk
        />

        {/* Budget Amount */}
        <TextInput
          label="Budget Amount"
          placeholder="Enter budget amount"
          type="number" // Specify the input type as number
          value={form.values.budget_amt}
          onChange={(event) => {
            const value = parseFloat(event.currentTarget.value); // Convert input to a number
            form.setFieldValue("budget_amt", Number.isNaN(value) ? 0 : value); // Handle NaN
          }}
          error={form.errors.budget_amt}
          withAsterisk
        />

        {/* PDF Upload */}
        <FileInput
          label="Attach PDF"
          placeholder="Upload your budget PDF"
          onChange={(file) => form.setFieldValue("budget_file", file)}
          error={form.errors.budget_file}
          accept=".pdf"
          withAsterisk
        />

        {/* Status */}
        <TextInput
          label="Status"
          placeholder="Enter the status"
          value={form.values.status}
          onChange={(event) =>
            form.setFieldValue("status", event.currentTarget.value)
          }
          error={form.errors.status}
          withAsterisk
        />

        {/* Remarks */}
        <TextInput
          label="Remarks"
          placeholder="Enter remarks"
          value={form.values.remarks}
          onChange={(event) =>
            form.setFieldValue("remarks", event.currentTarget.value)
          }
          error={form.errors.remarks}
          withAsterisk
        />

        {/* Submit Button */}
        <Group position="center" mt="md" className="submit-container">
          {token && (
            <Button type="submit" className="submit-btn">
              Submit
            </Button>
          )}
        </Group>
      </form>
    </Container>
  );
}

BudgetApprovalForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};

export { BudgetApprovalForm };

function BudgetForm({ clubName }) {
  return (
    <Container>
      <BudgetApprovalForm clubName={clubName} />
    </Container>
  );
}

BudgetForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};

export default BudgetForm;
