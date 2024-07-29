import { useState, Fragment } from "react";
import {
  BreachType,
  DataRowType,
  ColumnMeta,
  HandleToggleColumn,
} from "../types";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableOptions,
  MUISortOptions,
} from "mui-datatables"; // npm i mui-datatables / npm i --save-dev @types/mui-datatables
import { styled } from "@mui/material/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Tooltip from "@mui/material/Tooltip";

// ---------

// styling
const BoldTypography = styled("h6")({
  fontWeight: "bold",
  fontSize: "1.2rem",
  color: "red",
  margin: "0",
  padding: "0",
});

// No easy way to bold and center align column headers in MUI DataTables (setCellHeaderProps does not work), so need to create a custom header render function to use for each header
const CustomHeadRender = (
  columnMeta: ColumnMeta,
  handleToggleColumn: HandleToggleColumn,
  sortOrder: MUISortOptions
) => {
  const [sortDirection, setSortDirection] = useState<string>(
    sortOrder.direction || ""
  );
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const handleSort = (): void => {
    handleToggleColumn(columnMeta.index);
    setSortDirection((prevDirection: string) => {
      if (prevDirection === "asc") return "desc";
      if (prevDirection === "desc") return "";
      return "asc";
    });
    setTooltipOpen(false); // close tooltip on click
  };

  return (
    <Fragment key={columnMeta.index}>
      <Tooltip
        title="Sort"
        arrow
        open={tooltipOpen}
        onClose={() => setTooltipOpen(false)}
        onOpen={() => setTooltipOpen(true)}
      >
        <th
          style={{
            textAlign: "center",
            fontWeight: "bold",
            cursor: "pointer",
            borderBottom: "1px solid lightgrey",
            position: "relative",
            paddingBottom: "20px",
            paddingTop: "20px",
          }}
          onClick={handleSort}
        >
          {columnMeta.label}
          {sortDirection === "asc" && (
            <ArrowUpwardIcon
              style={{ fontSize: "1rem", marginLeft: "0.5rem" }}
            />
          )}
          {sortDirection === "desc" && (
            <ArrowDownwardIcon
              style={{ fontSize: "1rem", marginLeft: "0.5rem" }}
            />
          )}
        </th>
      </Tooltip>
    </Fragment>
  );
};

//   ---------

function DataTable({
  apiResponseArray,
  tableEmail,
}: {
  apiResponseArray: BreachType[];
  tableEmail: string;
}): JSX.Element {
  const columns: MUIDataTableColumnDef[] = [
    {
      name: "name",
      label: "NAME",
      options: {
        customHeadRender: (columnMeta, handleToggleColumn, sortOrder) =>
          CustomHeadRender(
            columnMeta as ColumnMeta,
            handleToggleColumn,
            sortOrder
          ),
        setCellProps: () => ({
          style: {
            textAlign: "center",
            width: "120px",
          },
        }),
      },
    },
    {
      name: "domain",
      label: "DOMAIN",
      options: {
        customHeadRender: (columnMeta, handleToggleColumn, sortOrder) =>
          CustomHeadRender(
            columnMeta as ColumnMeta,
            handleToggleColumn,
            sortOrder
          ),
        setCellProps: () => ({
          style: {
            textAlign: "center",
            width: "200px",
          },
        }),
      },
    },
    {
      name: "breachDate",
      label: "BREACH DATE",
      options: {
        customHeadRender: (columnMeta, handleToggleColumn, sortOrder) =>
          CustomHeadRender(
            columnMeta as ColumnMeta,
            handleToggleColumn,
            sortOrder
          ),
        setCellProps: () => ({
          style: {
            textAlign: "center",
            width: "150px",
          },
        }),
      },
    },
    {
      name: "userName",
      label: "USER NAME",
      options: {
        customHeadRender: (columnMeta, handleToggleColumn, sortOrder) =>
          CustomHeadRender(
            columnMeta as ColumnMeta,
            handleToggleColumn,
            sortOrder
          ),
        setCellProps: () => ({
          style: {
            textAlign: "center",
            width: "120px",
          },
        }),
      },
    },
    {
      name: "password",
      label: "PASSWORD",
      options: {
        customHeadRender: (columnMeta, handleToggleColumn, sortOrder) =>
          CustomHeadRender(
            columnMeta as ColumnMeta,
            handleToggleColumn,
            sortOrder
          ),
        setCellProps: () => ({
          style: {
            textAlign: "center",
            width: "120px",
          },
        }),
      },
    },
  ];

  // map the API response to the data table format (first confirming whether the API response is an array)
  const data: DataRowType[] = apiResponseArray.map((element: BreachType) => {
    return {
      name: element.Name,
      domain: element.Domain,
      breachDate: element.BreachDate,
      userName: element.DataClasses.includes("Usernames") ? "X" : "",
      password: element.DataClasses.includes("Passwords") ? "X" : "",
    };
  });

  const options: MUIDataTableOptions = {
    filterType: "checkbox",
    responsive: "standard",
    search: true,
    sort: true,
  };

  return (
    <MUIDataTable
      title={
        <BoldTypography>Identity Breach Results: {tableEmail}</BoldTypography>
      }
      data={data}
      columns={columns}
      options={options}
    />
  );
}

export default DataTable;
