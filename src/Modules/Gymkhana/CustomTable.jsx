import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import {
  flexRender,
  MRT_GlobalFilterTextInput,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  useMantineReactTable,
  MRT_TableBodyCellValue,
} from "mantine-react-table";
import { Divider, Flex, Stack, Table, Title } from "@mantine/core";
import PropTypes from "prop-types";

function CustomTable({ data, columns }) {
  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },

    mantinePaginationProps: {
      rowsPerPageOptions: ["5", "10", "15"],
    },
    paginationDisplayMode: "pages",
  });

  return (
    <Stack>
      <Divider />
      <Title order={4}>My Custom Headless Table</Title>
      <Flex justify="space-between" align="center">
        {/* eslint-disable-next-line react/jsx-pascal-case */}
        <MRT_GlobalFilterTextInput table={table} />
        {/* eslint-disable-next-line react/jsx-pascal-case */}
        <MRT_TablePagination table={table} />
      </Flex>

      <Table
        captionSide="top"
        fz="md"
        highlightOnHover
        horizontalSpacing="xl"
        striped
        verticalSpacing="xs"
        withTableBorder
        withColumnBorders
        m="0"
      >
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.Header ??
                          header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  {/* eslint-disable-next-line react/jsx-pascal-case */}
                  <MRT_TableBodyCellValue cell={cell} table={table} />
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {/* eslint-disable-next-line react/jsx-pascal-case */}
      <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
    </Stack>
  );
}

CustomTable.propTypes = {
  data: PropTypes.arrayOf({
    [PropTypes.string]: PropTypes,
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CustomTable;
