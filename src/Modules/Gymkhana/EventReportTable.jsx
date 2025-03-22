import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { ActionIcon } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";

const columns = [
  { accessorKey: "event", header: "Event" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "venue", header: "Venue" },
  { accessorKey: "incharge", header: "Incharge" },
  { accessorKey: "start_date", header: "Start Date" },
  { accessorKey: "end_date", header: "End Date" },
  { accessorKey: "start_time", header: "Start Time" },
  { accessorKey: "end_time", header: "End Time" },
  { accessorKey: "event_budget", header: "Event Budget" },
  { accessorKey: "special_announcement", header: "Special Announcement" },
  { accessorKey: "report_pdf", header: "Report PDF" },
];

function EventReportTable({ clubName }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    fetch(
      `http://localhost:8000/gymkhana/api/event_report_list/?club=${clubName}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Events:", data);
        setEvents(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [clubName]);

  const table = useMantineReactTable({
    columns,
    data: events,
    enableEditing: false,
    getRowId: (row) => row.id,
    enableRowActions: true,
    positionActionsColumn: "first",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Actions",
      },
    },
    renderRowActions: ({ row }) => (
      <ActionIcon
        color="blue"
        component="a"
        href={row.original.report_pdf}
        target="_blank"
        rel="noopener noreferrer"
        disabled={!row.original.report_pdf}
        title="View Report"
      >
        <IconEye size={18} />
      </ActionIcon>
    ),
    mantineToolbarAlertBannerProps: isError
      ? { color: "red", children: "Error loading data" }
      : undefined,
    state: {
      isLoading,
      showAlertBanner: isError,
    },
  });
  return <MantineReactTable table={table} />;
}

EventReportTable.propTypes = {
  clubName: PropTypes.string.isRequired,
};

export default EventReportTable;
