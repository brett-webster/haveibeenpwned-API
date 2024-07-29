import axios from "axios";
import fetchAllBreaches from "./fetchAllBreaches";
import { BreachType } from "../types";
import { emailFourExpectedOutput } from "./fixtures";

jest.mock("axios");

// fetchAllBreaches() tests
describe("correctly fetches all known breaches from external API or throws error", () => {
  let email: string;
  beforeAll(() => {
    email = "abetaylor@hotmail.com"; // 3 known breaches
  });

  it("should fetch breaches for the given email", async () => {
    const mockData: BreachType[] = emailFourExpectedOutput;

    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await fetchAllBreaches(email);

    expect(response).toEqual(mockData);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(axios.get).toHaveBeenCalledWith(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${email}/?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": process.env.HIBP_API_KEY,
        },
      }
    );
  });

  it("should throw error if the request fails", async () => {
    const errorMessage = "Network Error";

    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(fetchAllBreaches(email)).rejects.toThrow(errorMessage);
  });
});
