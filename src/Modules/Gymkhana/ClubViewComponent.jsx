import { Box, Group, Stack, Tabs, Text } from "@mantine/core";
import { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import EventApprovalsWithProviders from "./ApprovalsTable";
import CoordinatorMembersWithProviders from "./CoordinatorMembersTable";
import BudgetApprovalsWithProviders from "./BudgetApprovalTable";
import { useGetCurrentLoginnedRoleRelatedClub } from "./BackendLogic/ApiRoutes";

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
  const token = localStorage.getItem("authToken");
  const userRole = user.role;
  const [activeclubfeature, setactiveclubfeature] = useState("About");
  const { data: CurrentLogginedRelatedClub = [] } =
    useGetCurrentLoginnedRoleRelatedClub(user.username, token);

  const renderActiveContent = () => {
    switch (activeclubfeature) {
      case "About":
        return <Text>Lorem Text over here from DB </Text>;
      case "Members":
        return (
          <Suspense fallback={<div>Loading Members Table</div>}>
            <CustomTable
              data={membersData}
              columns={membersColumns}
              TableName="Members"
            />
          </Suspense>
        );
      case "Achievements":
        return (
          <Suspense fallback={<div>Loading Acheievements ...</div>}>
            <CustomTable
              columns={achievementsColumns}
              data={achievementsData}
              TableName="Acheievements"
            />
          </Suspense>
        );
      case "Events":
        return (
          <Suspense fallback={<div>Loading Events Table.....</div>}>
            <CustomTable
              columns={eventsColumns}
              data={eventsData}
              TableName="Events"
            />
          </Suspense>
        );
      case "EventsApproval":
        return (
          <Suspense fallback={<div>Loading Table component</div>}>
            <EventApprovalsWithProviders clubName={clubName} />
          </Suspense>
        );
      case "BudgetApproval":
        return (
          <Suspense fallback={<div>Loading Table component</div>}>
            <BudgetApprovalsWithProviders clubName={clubName} />
          </Suspense>
        );
      case "Members_co-ordinator":
        return (
          <Suspense fallback={<div>Loading Members Table</div>}>
            <CoordinatorMembersWithProviders clubName={clubName} />
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
  console.log(CurrentLogginedRelatedClub, clubName, user);
  return (
    <Box style={{ height: "100vh" }}>
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
              {userRole === "Dean_s" && (
                <>
                  <Tabs.Tab value="EventsApproval">EventsApproval</Tabs.Tab>
                  <Tabs.Tab value="BudgetApproval"> Budget Approval</Tabs.Tab>
                </>
              )}
              {(userRole === "FIC" ||
                userRole === "Counsellor" ||
                userRole === "Professor") &&
                CurrentLogginedRelatedClub.length > 0 &&
                CurrentLogginedRelatedClub[0].club === clubName && (
                  <>
                    <Tabs.Tab value="EventsApproval">EventsApproval</Tabs.Tab>
                    <Tabs.Tab value="BudgetApproval"> Budget Approval</Tabs.Tab>
                  </>
                )}
              {user.role === "co-ordinator" &&
                CurrentLogginedRelatedClub.length > 0 &&
                CurrentLogginedRelatedClub[0].club === clubName && (
                  <>
                    <Tabs.Tab value="EventsApproval">EventsApproval</Tabs.Tab>
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
      <Box h="80vh" mt="20px">
        {renderActiveContent()}
      </Box>
    </Box>
  );
}

ClubViewComponent.propTypes = {
  clubName: PropTypes.string.isRequired,
  AboutClub: PropTypes.string.isRequired,
  membersData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      roleNo: PropTypes.string.isRequired,
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
