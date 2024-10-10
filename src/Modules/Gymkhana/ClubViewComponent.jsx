import { Container, Group, Stack, Tabs, Text } from "@mantine/core";
import { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import RegistrationForm from "./RegistrationForm";

const CustomTable = lazy(() => import("./CustomTable"));
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
      <Container h="80vh" mt="20px">
        {renderActiveContent()}
      </Container>
    </Container>
  );
}

export default ClubViewComponent;
