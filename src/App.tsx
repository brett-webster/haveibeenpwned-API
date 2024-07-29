import { useState } from "react";
import axios from "axios";
import "./App.css";
import { BreachType } from "../types";
import DataTable from "./DataTable";

function App() {
  const [inputEmail, setInputEmail] = useState<string>("");
  const [tableEmail, setTableEmail] = useState<string>("");
  const [apiResponseArray, setApiResponseArray] = useState<BreachType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [noBreachesFound, setNoBreachesFound] = useState<boolean>(false);

  // helper fxns
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetFieldsAndTable = (): void => {
    setTableEmail(inputEmail); // set table email to input email (for display in DataTable)
    setInputEmail(""); // reset input field onSubmit
    setApiResponseArray([]); // clear the old table data
    setErrorMessage(""); // clear any previous error messages
    setNoBreachesFound(false); // reset the "No breaches found" boolean (so message doesn't persist)
  };

  // on field input + button click --> GET request
  const callEndpointOnClick = async (): Promise<void> => {
    if (!validateEmail(inputEmail)) {
      setErrorMessage("Invalid email address. Please try again");
      return; // early exit if invalid email
    }

    resetFieldsAndTable();

    try {
      const postResponse: BreachType[] = (
        await axios.get<BreachType[]>(`/api/breaches?email=${inputEmail}`)
      )?.data;

      setApiResponseArray(postResponse);
      if (!postResponse.length) setNoBreachesFound(true); // set flag to true if no breaches found (to display message)
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFieldValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputEmail(event.target.value);
  };

  // -------------------

  return (
    <>
      <h1>haveibeenpwned API</h1>

      <p className="input-prompt">
        Enter a valid email address to see if it has been compromised in a data
        breach:
      </p>
      <br></br>
      <br></br>

      <input
        value={inputEmail}
        onChange={handleFieldValueChange}
        className="input-field"
      ></input>
      <br></br>
      <br></br>

      <button onClick={() => void callEndpointOnClick()}>Submit</button>
      <button onClick={() => void resetFieldsAndTable()}>Clear</button>
      <br></br>
      <br></br>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div>
        <br></br>
        {apiResponseArray.length === 0 && !errorMessage ? (
          <>{noBreachesFound && "No breaches found"}</>
        ) : !errorMessage ? (
          <DataTable
            apiResponseArray={apiResponseArray}
            tableEmail={tableEmail}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default App;
