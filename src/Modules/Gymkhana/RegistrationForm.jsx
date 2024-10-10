import React from "react";
import { useForm, isEmail } from "@mantine/form";
import {
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Group,
  Container,
} from "@mantine/core";

function ClubRegistrationForm({ clubName }) {
  // Set up the form with initial values and validation
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      rollNumber: null,
      email: "",
      achievements: "",
      experience: "",
    },

    validate: {
      firstName: (value) =>
        value.length < 2 ? "First name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Last name must have at least 2 letters" : null,
      rollNumber: (value) =>
        value <= 0 ? "Roll number must be a positive number" : null,
      email: (value) => (isEmail(value) ? null : "Invalid email format"),
    },
  });

  // Submit handler
  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
    // Add your submission logic here
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* First Name */}
        <TextInput
          label="First Name"
          placeholder="Enter your first name"
          {...form.getInputProps("firstName")}
          withAsterisk
        />

        {/* Last Name */}
        <TextInput
          label="Last Name"
          placeholder="Enter your last name"
          {...form.getInputProps("lastName")}
          withAsterisk
        />

        {/* Roll Number */}
        <NumberInput
          label="Roll Number"
          placeholder="Enter your roll number"
          {...form.getInputProps("rollNumber")}
          withAsterisk
        />

        {/* Email */}
        <TextInput
          label="Email"
          placeholder="Enter your email"
          {...form.getInputProps("email")}
          withAsterisk
        />

        {/* Achievements */}
        <Textarea
          label="Achievements"
          placeholder="Describe your achievements"
          {...form.getInputProps("achievements")}
        />

        {/* Experience */}
        <Textarea
          label="Experience"
          placeholder="Describe your experience"
          {...form.getInputProps("experience")}
        />

        {/* Submit Button */}
        <Group position="center" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
}

export { ClubRegistrationForm };

function RegistrationForm({ clubName }) {
  return (
    <Container>
      <h2>Hello from {clubName} - Enter your details for Registering !!!</h2>
      <ClubRegistrationForm clubName={clubName} />
    </Container>
  );
}

export default RegistrationForm;
