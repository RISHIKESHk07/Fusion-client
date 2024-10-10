import { Container, Group, Stack, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import { MantineReactTable } from "mantine-react-table";
import { useSelector } from "react-redux";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import RegistrationForm from "./RegistrationForm";

function ClubViewComponent({
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
        return <Text>This is the about section for the {clubName} club.</Text>;
      case "Members":
        return (
          <MantineReactTable
            columns={membersColumns}
            data={membersData}
            enablePagination={false}
            layoutMode="grid" // Will span the available height
          />
        );
      case "Achievements":
        return (
          <MantineReactTable
            columns={achievementsColumns}
            data={achievementsData}
            enablePagination={false}
            layoutMode="grid" // Will span the available height
          />
        );
      case "Events":
        return (
          <MantineReactTable
            columns={eventsColumns}
            data={eventsData}
            enablePagination={false}
            layoutMode="grid" // Will span the available height
          />
        );
      case "EventsApproval":
        return <div>Event approval dashboard page</div>;
      case "BudgetApproval":
        return <div>Budget approval dashboard page</div>;
      case "Members_co-ordinator":
        return <div>Coordinator Members Component</div>;
      case "Events_co-ordinator":
        return <div>Coordinator Events Component</div>;
      case "EventsApprovalForm":
        return <div>Coordinator Events Approval Form Component</div>;
      case "BudgetApprovalForm":
        return <div>Coordinator Budget Form Component</div>;
      default:
        return (
          <Stack align="content-center">
            <RegistrationForm clubName={clubName} />
          </Stack>
        );
    }
  };

  return (
    <Container style={{ height: "100vh" }}>
      {" "}
      {/* Ensures it spans the full viewport height */}
      <Group>
        <Text align="content-start">{clubName}</Text>

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
              <Tabs.Tab value="Register">Register</Tabs.Tab>
              {user.role === "co-ordinator" && (
                <>
                  <Tabs.Tab value="EventsApproval">Event Approval</Tabs.Tab>
                  <Tabs.Tab value="BudgetApproval">Budget Approval</Tabs.Tab>
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
      <Container h="80vh" mt="10px">
        {renderActiveContent()}
      </Container>
    </Container>
  );
}

export default ClubViewComponent;
