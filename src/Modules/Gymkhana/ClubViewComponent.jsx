import { Container, Group, Stack, Tabs, Text } from "@mantine/core";
import { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";

const RegistrationForm = lazy(() => import("./RegistrationForm"));
const CustomTable = lazy(() => import("./CustomTable"));
const EventForm = lazy(() => import("./EventForm"));
const BudgetForm = lazy(() => import("./BudgetForm"));
function ClubViewComponent({
  AboutClub,
  clubName,
  membersData,
  achievementsData,
  eventsData,
  membersColumns,
  achievementsColumns,
  eventsColumns,
}) {
  const user = useSelector((state) => state.user);
  const [activeclubfeature, setactiveclubfeature] = useState("About");

  const renderActiveContent = () => {
    switch (activeclubfeature) {
      case "About":
        return (
          <Text>
            This is the about section for the {clubName} club.Lorem ipsum is a
            placeholder text commonly used in design, typesetting, and web
            development to demonstrate the visual form of a document or a
            typeface without relying on meaningful content. The text is derived
            from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
            Malorum," a 45 BC work by Cicero, and is often used because it
            approximates the distribution of letters in English, providing a
            natural look to layouts. The standard "Lorem ipsum" text has been
            used in the printing industry since the 1500s when an unknown
            printer scrambled parts of Cicero's text to create a type specimen
            book. Since then, it has become the industry's default placeholder
            text, maintaining its popularity through centuries of evolving
            design and printing technology.
            {AboutClub}
          </Text>
        );
      case "Members":
        return (
          <Suspense fallback={<div>Loading Members Table</div>}>
            <CustomTable data={membersData} columns={membersColumns} />;
          </Suspense>
        );
      case "Achievements":
        return (
          <Suspense fallback={<div>Loading Acheievements ...</div>}>
            <CustomTable
              columns={achievementsColumns}
              data={achievementsData}
            />
          </Suspense>
        );
      case "Events":
        return (
          <Suspense fallback={<div>Loading Events Table.....</div>}>
            <CustomTable columns={eventsColumns} data={eventsData} />;
          </Suspense>
        );
      case "EventsApproval":
        return (
          <Suspense fallback={<div>Loading Table component</div>}>
            <CustomTable data={eventsData} columns={eventsColumns} />
          </Suspense>
        );
      case "BudgetApproval":
        return <div>Budget approval dashboard page</div>;
      case "Members_co-ordinator":
        return (
          <Suspense fallback={<div>Loading Members Table</div>}>
            <CustomTable data={membersData} columns={membersColumns} />;
            {/* need to make query prop wghich would filter the data if required  */}
          </Suspense>
        );
      case "Events_co-ordinator":
        return (
          <Suspense fallback={<div>Loading Table component</div>}>
            <CustomTable data={eventsData} columns={eventsColumns} />{" "}
            {/* need to make query prop wghich would filter the data if required  */}
          </Suspense>
        );
      case "EventsApprovalForm":
        return (
          <Suspense fallback={<div>Loading Events Approval Form...</div>}>
            <EventForm clubName={clubName} />
          </Suspense>
        );
      case "BudgetApprovalForm":
        return (
          <Suspense fallback={<div>Loading Budget Approval Form...</div>}>
            <BudgetForm clubName={clubName} />
          </Suspense>
        );
      default:
        return (
          <Stack align="center">
            <Suspense fallback={<div>Loading Registration Form...</div>}>
              <RegistrationForm clubName={clubName} />
            </Suspense>
          </Stack>
        );
    }
  };
  return (
    <Container style={{ height: "100vh", width: "100vw" }}>
      {" "}
      {/* Ensures it spans the full viewport height */}
      <Group justify="space-between">
        <Text align="content-start" fw={800} size="40px">
          {clubName}
        </Text>

        <Group>
          <Tabs value={activeclubfeature} onChange={setactiveclubfeature}>
            <Tabs.List>
              <Tabs.Tab value="About">About</Tabs.Tab>

              {user.role === "co-ordinator" ? (
                <Tabs.Tab value="Members_co-ordinator">Members</Tabs.Tab>
              ) : (
                <Tabs.Tab value="Members">Members</Tabs.Tab>
              )}
              <Tabs.Tab value="Achievements">Achievements</Tabs.Tab>
              {user.role === "co-ordinator" ? (
                <Tabs.Tab value="Events_co-ordinator">Events</Tabs.Tab>
              ) : (
                <Tabs.Tab value="Events">Events</Tabs.Tab>
              )}
              {user.role !== "co-ordinator" && (
                <Tabs.Tab value="Register">Register</Tabs.Tab>
              )}
              {user.role === "co-ordinator" && (
                <>
                  <Tabs.Tab value="EventsApproval">Event Approval</Tabs.Tab>
                  <Tabs.Tab value="BudgetApproval"> Budget Approval</Tabs.Tab>
                  <Tabs.Tab value="EventsApprovalForm">
                    Events approval Form
                  </Tabs.Tab>
                  <Tabs.Tab value="BudgetApprovalForm">
                    Budget approval Form
                  </Tabs.Tab>
                </>
              )}
            </Tabs.List>
          </Tabs>
        </Group>
      </Group>
      {/* Render the active content based on the active tab */}
      <Container h="80vh" mt="20px">
        {renderActiveContent()}
      </Container>
    </Container>
  );
}

ClubViewComponent.propTypes = {
  clubName: PropTypes.string.isRequired,
  AboutClub: PropTypes.string.isRequired,
  membersData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }),
  ).isRequired,

  achievementsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired, // Assuming year is a string, e.g., "2022"
    }),
  ).isRequired,

  eventsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired, // Assuming date is a string in "YYYY-MM-DD" format
    }),
  ).isRequired,

  membersColumns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    }),
  ).isRequired,

  achievementsColumns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    }),
  ).isRequired,

  eventsColumns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ClubViewComponent;
