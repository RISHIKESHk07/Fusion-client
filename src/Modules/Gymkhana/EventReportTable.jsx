import PropTypes from "prop-types";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

const columns = [
  { accessorKey: "event_name", header: "Event Name" },
  { accessorKey: "venue", header: "Venue" },
  { accessorKey: "incharge", header: "Incharge" },
  { accessorKey: "start_date", header: "Start Date" },
  { accessorKey: "end_date", header: "End Date" },
  { accessorKey: "start_time", header: "Start Time" },
  { accessorKey: "end_time", header: "End Time" },
  { accessorKey: "event_poster", header: "Event Poster" },
  { accessorKey: "special_announcement", header: "Special Announcement" },
  { accessorKey: "club", header: "Club" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "event_budget", header: "Event Budget" },
];

function EventReportTable({ events, isLoading, isError }) {
  const safeEvents = Array.isArray(events) ? events : [];

  const table = useMantineReactTable({
    columns,
    data: safeEvents,
    enableEditing: true,
    getRowId: (row) => row.id,
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
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      event_name: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
      incharge: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      end_date: PropTypes.string.isRequired,
      start_time: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
      event_poster: PropTypes.string,
      special_announcement: PropTypes.string,
      club: PropTypes.string.isRequired,
      description: PropTypes.string,
      event_budget: PropTypes.number,
      status: PropTypes.string.isRequired,
    }),
  ),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
};

EventReportTable.defaultProps = {
  events: [],
};

export default EventReportTable;
