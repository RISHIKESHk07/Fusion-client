import React from "react";
import SpecialTable from "./SpecialTable";
import { data } from "./data";

const columns = [
  {
    accessorKey: "name.eventName",
    header: "Event Name",
  },
  {
    accessorKey: "name.clubName",
    header: "Club Name",
  },
  {
    accessorKey: "time",
    header: "Date & Time",
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
];

const parseEventDate = (dateString) => {
  const [day, month, time] = dateString.split(/[\s,]+/);
  const fullDateString = `${day} ${month} ${new Date().getFullYear()} ${time}`;
  return new Date(fullDateString);
};

const sortedData = data.sort(
  (a, b) => parseEventDate(a.time) - parseEventDate(b.time),
);

function EventComponent() {
  return (
    <SpecialTable columns={columns} data={sortedData} rowOptions={["6"]} />
  );
}

export default EventComponent;
