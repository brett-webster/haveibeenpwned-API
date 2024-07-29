import axios, { AxiosResponse } from "axios";
import { BreachType } from "../types";

async function fetchAllBreaches(email: string): Promise<BreachType[]> {
  const response: AxiosResponse<BreachType[]> = await axios.get<BreachType[]>(
    `https://haveibeenpwned.com/api/v3/breachedaccount/${email}/?truncateResponse=false`,
    {
      headers: {
        "hibp-api-key": process.env.HIBP_API_KEY,
      },
    }
  );

  return response.data;
}

export default fetchAllBreaches;
