import React, { useState } from "react";
import { useForm, isEmail } from "@mantine/form";
import { TextInput, Textarea, Button, Group, Container } from "@mantine/core";

import "./GymkhanaForms.css";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const token = localStorage.getItem("authToken");
function ClubRegistrationForm({ clubName }) {
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState({ type: "", text: "" });
  // Set up the form with initial values and validation
  const user = useSelector((state) => state.user);
  const form = useForm({
    initialValues: {
      name: user.username,
      rollNumber: null,
      email: "",
      achievements: "",
      experience: "",
      club: clubName,
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "First name must have at least 2 letters" : null,
      rollNumber: (value) =>
        value.length < 8 ? "Roll no must have at least 8 letters" : null,
      email: (value) => (isEmail(value) ? null : "Invalid email format"),
    },
  });
  // TODO need to add logic for addition to DB
  const mutation = useMutation({
    mutationFn: (newMemberData) => {
      return axios.post(
        "http://localhost:8000/gymkhana/api/club_membership/",
        {
          member: newMemberData.rollNumber.toString(),
          club: newMemberData.club,
          description: `Experience: ${newMemberData.experience}\nAchievement: ${newMemberData.achievements}`,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }, // Replace with your actual API endpoint
      );
    },
  });
  // Submit handler
  const handleSubmit = (values) => {
    setMessage({ type: "", text: "" }); // Reset message
    mutation.mutate(values, {
      onSuccess: (response) => {
        // Handle success (you can redirect or show a success message)
        console.log("Successfully registered:", response.data);
        setMessage({ type: "success", text: "Registration successful!" });
      },
      onError: (error) => {
        // Handle error (you can show an error message)
        console.error("Error during registration:", error);
        setMessage({
          type: "error",
          text: "Registration failed. Please try again.",
        });
      },
    });
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)} className="club-form">
        {/* Name */}
        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={form.values.name}
          onChange={(event) =>
            form.setFieldValue("name", event.currentTarget.value)
          }
          error={form.errors.name}
          withAsterisk
        />

        {/* Roll Number */}
        <TextInput
          label="Roll Number"
          placeholder="Enter your roll number"
          value={form.values.rollNumber}
          onChange={(event) =>
            form.setFieldValue("rollNumber", event.currentTarget.value)
          }
          error={form.errors.rollNumber}
          withAsterisk
        />

        {/* Email */}
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          error={form.errors.email}
          withAsterisk
        />

        {/* Achievements */}
        <Textarea
          label="Achievements"
          placeholder="Describe your achievements"
          value={form.values.achievements}
          onChange={(event) =>
            form.setFieldValue("achievements", event.currentTarget.value)
          }
        />

        {/* Experience */}
        <Textarea
          label="Experience"
          placeholder="Describe your experience"
          value={form.values.experience}
          onChange={(event) =>
            form.setFieldValue("experience", event.currentTarget.value)
          }
        />

        {/* Submit Button */}
        <Group position="center" mt="md">
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

export { ClubRegistrationForm };

function RegistrationForm({ clubName }) {
  return (
    <Container>
      <h2 className="club-header">
        Hello from {clubName} - Enter your details for Registering !!!
      </h2>
      <ClubRegistrationForm clubName={clubName} />
    </Container>
  );
}
RegistrationForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};
ClubRegistrationForm.propTypes = {
  clubName: PropTypes.string.isRequired,
};

export default RegistrationForm;
