import filterBreaches from "./filterBreaches.ts";
import { BreachType } from "../types";
import {
  emailOneInput,
  emailTwoInput,
  emailThreeInput,
  emailOneExpectedOutput,
  emailTwoExpectedOutput,
  emailThreeExpectedOutput,
} from "./fixtures";

// NOTE: using toEqual() below uniformly to validate deep equality of arrays / objects

// filterBreaches() tests
// NOTE:  any fetching error to external API (e.g. 404) is caught in server's try block and execution does not proceed to invoke filterBreaches()
describe("correctly filters out only those data breaches involving user name or email", () => {
  it("correctly returns empty array when input is empty array (hypothetical edge case)", () => {
    const actualOutput: BreachType[] = filterBreaches([]);
    expect(actualOutput).toEqual([]);
  });

  it("correctly returns single object when input is single object containing user name / password", () => {
    const actualOutput: BreachType[] = filterBreaches(emailOneInput);
    expect(actualOutput).toHaveLength(1);
    expect(actualOutput).toEqual(emailOneExpectedOutput);
  });

  it("correctly returns 6 objects when input is array of 12 objects, 6 containing user name / password", () => {
    const actualOutput: BreachType[] = filterBreaches(emailTwoInput);
    expect(actualOutput).toHaveLength(6);
    expect(actualOutput).toEqual(emailTwoExpectedOutput);
  });

  it("correctly returns 12 objects when input is array of 20 objects, 12 containing user name / password", () => {
    const actualOutput: BreachType[] = filterBreaches(emailThreeInput);
    expect(actualOutput).toHaveLength(12);
    expect(actualOutput).toEqual(emailThreeExpectedOutput);
  });
});
