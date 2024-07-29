import { useState } from "react";
import axios from "axios";
import "./App.css";
import { BreachType } from "../types";

function App() {
  const [inputEmail, setInputEmail] = useState<string>("");
  const [apiResponseArray, setApiResponseArray] = useState<BreachType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // helper fxns
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetFieldsAndTable = (): void => {
    setInputEmail(""); // reset input field onSubmit
    setApiResponseArray([]); // clear the old table data
    setErrorMessage(""); // clear any previous error messages
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

      <input value={inputEmail} onChange={handleFieldValueChange}></input>
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
          <> No breaches found</>
        ) : !errorMessage ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Domain</th>
                <th>BreachDate</th>
                <th>UserName</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {apiResponseArray.map((elem) => {
                const userNameBreached: boolean =
                  elem.DataClasses.includes("Usernames");
                const passwordBreached: boolean =
                  elem.DataClasses.includes("Passwords");

                return (
                  <tr key={elem.Name}>
                    <td>{elem.Name}</td>
                    <td>{elem.Domain}</td>
                    <td>{elem.BreachDate}</td>
                    <td>{userNameBreached ? "X" : ""}</td>
                    <td>{passwordBreached ? "X" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default App;
