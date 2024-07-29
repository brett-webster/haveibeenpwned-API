import { BreachType, DataRowType, ApiResponseArrayType } from "../types";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableOptions,
} from "mui-datatables"; // npm i mui-datatables / npm i --save-dev @types/mui-datatables

// ---------

function DataTable(apiResponseArrayObj: ApiResponseArrayType): JSX.Element {
  const { apiResponseArray } = apiResponseArrayObj; // destructure the API response array object prop

  const columns: MUIDataTableColumnDef[] = [
    { name: "name", label: "Name" },
    { name: "domain", label: "Domain" },
    { name: "breachDate", label: "Breach Date" },
    { name: "userName", label: "User Name" },
    { name: "password", label: "Password" },
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
      title={"Identity Breach Results"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}

export default DataTable;
