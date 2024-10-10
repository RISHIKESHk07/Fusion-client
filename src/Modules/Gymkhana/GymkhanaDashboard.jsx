import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Container,
  Group,
  Paper,
  Select,
  Tabs,
  Text,
} from "@mantine/core";
import ClubViewComponent from "./ClubViewComponent";

function GymkhanaDashboard() {
  const user = useSelector((state) => state.user);
  console.log("user", user);
  const [activeTab, setActiveTab] = useState("Clubs");
  const [value, setValue] = useState("Select a Club");
  return (
    <>
      <div>
        {user.username}s Gymkanaha dashboard , role is {user.role}
      </div>{" "}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="Clubs">Clubs</Tabs.Tab>
          <Tabs.Tab value="Calender">Calender</Tabs.Tab>
          <Tabs.Tab value="Fests">Fests</Tabs.Tab>
          <Tabs.Tab value="Events">Events</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Clubs" h="100vh">
          <Group justify="end" mt="5px">
            <Select
              data={["TPC", "AFC"]}
              value={value}
              placeholder="Select a Club"
              onChange={setValue}
              w="220px"
            />
          </Group>
          <Container mt="10px" mx="0" my="xs">
            {value === "Select a Club" ? (
              <Paper shadow="md" p="xl" h="80vh" w="80vw" ml="20px">
                <Container>
                  <h4>Brief Information regarding Science</h4>
                  <Text mt="5px">
                    <span style={{ fontWeight: 900 }}>
                      Clubs Cultural Club:
                    </span>
                    The Institute has vibrant Cultural Clubs that provide a
                    platform for students to showcase their creativity and
                    talent. There are six clubs associated with our cultural
                    fraternity, namely: (i) Saaz (Music Club), (ii) Jazbaat
                    (Dramatics Society Club), (iii) Aavartan (Dance Club), (iv)
                    Abhivayakti (Arts & Craft Club), (v) Aakrti (The Film Making
                    & Photography Club), and (vi) Samvaad (Literature & Quizzing
                    Society Club). The activities of the cultural committee are
                    largely student-driven with proper guidance from faculty
                    members. These clubs are active throughout the year. Besides
                    helping students in honing their talent and skills, they
                    organize their respective annual festivals.
                  </Text>
                  <Text mt="5px">
                    <span style={{ fontWeight: 900 }}>
                      Science & Technology Club
                    </span>
                    :There are in all 7 different Science and Technology Clubs
                    which are mentored separately by Faculty Members. Since the
                    inception of the Institute, the technical fest “Abhikalpan”
                    held annually is a popular event among different colleges of
                    Jabalpur and the surrounding regions. Apart from that,
                    Hackathon, Racing, Programming, Electronics, 3D priniting,
                    Business and Management, Fabrication and Astronomy related
                    events are organized throughout the year.
                  </Text>
                  <Text mt="5px">
                    <span style={{ fontWeight: 900 }}>Sports Club:</span>Sports
                    and games play a major role in keeping a person fit and
                    fine. Sports in general inculcates, team work, mental
                    strength and physical fitness along with ethics, respect to
                    the opponent, fair play in real life aspects as well. Truly
                    said! At IIITDM Jabalpur, we provide facilities for students
                    to experience “above and beyond” academic experience, to
                    maintain their physical fitness and to excel as a bright
                    student. IIITDM Jabalpur has excellent infrastructure
                    facilities for both outdoor and indoor games and sports. The
                    outdoor games include Volley Ball, Foot Ball, and Cricket,
                    Lawn Tennis, Basket Ball and Athletic ground. A Flood light
                    facility is provided for outdoor games like volleyball, lawn
                    tennis, basketball and Football. The Indoor-Students
                    Activity Center (SAC) provides the following facilities:
                    Shuttle Badminton, Chess, Caroms and Table Tennis with
                    wooden flooring, and other multi-Gyms activities. We are
                    preparing students by organizing intramural and extramural
                    competitions. We encourage student participation in
                    inter-collegiate, inter-IIIT and other open tournaments
                    across the country.
                  </Text>
                </Container>
              </Paper>
            ) : (
              <ClubViewComponent
                clubName={value}
                membersData={[
                  { name: "John Doe", role: "President" },
                  { name: "Jane Smith", role: "Vice President" },
                  // add more members here
                ]}
                achievementsData={[
                  { title: "First Place at Hackathon", year: "2022" },
                  { title: "Best Club Award", year: "2023" },
                  // add more achievements here
                ]}
                eventsData={[
                  { name: "Coding Bootcamp", date: "2024-01-15" },
                  { name: "Tech Fest", date: "2024-03-10" },
                  // add more events here
                ]}
                membersColumns={[
                  { accessorKey: "name", header: "Name" },
                  { accessorKey: "role", header: "Role" },
                ]}
                achievementsColumns={[
                  { accessorKey: "title", header: "Title" },
                  { accessorKey: "year", header: "Year" },
                ]}
                eventsColumns={[
                  { accessorKey: "name", header: "Event Name" },
                  { accessorKey: "date", header: "Date" },
                ]}
              />
            )}
          </Container>
        </Tabs.Panel>

        <Tabs.Panel value="Calender" h="100vh">
          <Container mt="10px" mx="0" my="xs">
            <Button>Filter Button</Button>
          </Container>
          <Container>Calender Component falls over here</Container>
        </Tabs.Panel>

        <Tabs.Panel value="Fests" h="100vh">
          <Container mt="10px" mx="0" my="xs">
            Previous Fests Component falls over here
          </Container>
          {/* need to make page where we have previous Fests listed here in Table */}
        </Tabs.Panel>

        <Tabs.Panel value="Events" h="100vh">
          <Container mt="10px" mx="0" my="xs">
            Need to fetch Events from the APIS over here
          </Container>
          {/* need to make a Table with previous Events in Campus */}
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default GymkhanaDashboard;
