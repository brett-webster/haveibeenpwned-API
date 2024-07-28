// npm run DEV -------> "dev": "NODE_ENV=development npm run server & wait-on http://localhost:3000 && NODE_ENV=development vite",  .....  INITIAL COMMAND WAS AS FOLLOWS, but needed to revise / add in 'wait-on' since Vite client app loaded faster than Express server causing error --> "NODE_ENV=development vite & NODE_ENV=development npm run server",
// npm run BUILD -----> "build": "tsc && vite build",
// npm run LINT ------> "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
// npm run PREVIEW ---> "preview": "NODE_ENV=production node --loader ts-node/esm server/server.ts",
// npm run SERVER ----> "server": "nodemon --exec 'node --loader ts-node/esm' server/server.ts"

// "proxy": "http://localhost:3000" (set in package.json config & vite.config.js)
// HRM for Vite frontend & nodemon for Express backend

// --------

import express, { Application, Request, Response, NextFunction } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url"; // NOTE: __dirname global is not available in an ES module, so we use fileURLToPath and dirname instead to derive it
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import axios, { AxiosResponse } from "axios";
import { BreachType, QueryParamType } from "../types";

const PORT =
  process.env.npm_package_config_proxy_server_port ?? process.env.PORT ?? 3000; // defaults to 3000 if NO port is specified in EITHER package.json DEV script nor .env file (in that order)

export const app: Application = express();
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies ('true' for nested objects)
app.use(helmet()); // secure HTTP headers
app.use(morgan("combined")); // log HTTP requests

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/static", express.static(join(__dirname, "../src/assets"))); // used to serve static images from assets folder

// --------

dotenv.config(); // dotenv goes away w/ Node v20 (i.e. can remove 'dotenv' from package.json & simply add an --env-file flag in the run CLI command)

// For production mode ONLY ('npm run build' first in CLI...) -- ENSURE 2 below path.joins are correct for file directory hierarchy
if (process.env.NODE_ENV === "production") {
  console.log(
    `DEPLOYED, RUNNING IN PRODUCTION MODE ON port ${PORT} at 'http://localhost:${PORT}/' ...`
  );
  // statically serve everything in the dist folder on the route '/dist', if already built -- this includes a pre-built index.html & index-*.js (latter similar to bundle.js, in dist/assets folder)
  app.use(express.static(join(__dirname, "../dist"))); // 2 dots in order to go up one level to server folder level (i.e. root)
  // serve index.html on the route '/'
  app.get("/", (_req: Request, res: Response) => {
    return res.status(200).sendFile(join(__dirname, "../dist/index.html")); // 2 dots in order to go up one level to server folder level (i.e. root)
  });
}

// --------

// DOCS:  https://haveibeenpwned.com/API/v3

// Single endpoint --> '/breaches'
// GET request --> returns all breaches for a given email address (provided as a query parameter) filtered by those possessing passwords or usernames (i.e. "DataClasses" property includes "Passwords" and/or "Usernames")
app.get("/breaches", async (req: Request, res: Response) => {
  try {
    // Note:  Email address validated on the front-end
    const { email } = req.query as QueryParamType; // destructure query param, using type assertion

    const response: AxiosResponse<BreachType[]> = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${email}/?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": process.env.HIBP_API_KEY,
        },
      }
    );

    // filter out breaches that don't contain passwords or usernames
    const filteredBreaches: BreachType[] = response.data.filter(
      (element: BreachType) =>
        element.DataClasses.includes("Passwords") ||
        element.DataClasses.includes("Usernames")
    );

    res.json(filteredBreaches);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching posts:", error.message);
    } else {
      console.error("Error fetching posts:", error);
      res.status(500).send("Internal Server Error");
    }
  }
});

app.get("/", (_req: Request, res: Response): Response => {
  return res.send("Hello, world!");
});

// --------

//404 handler
app.use((_req: Request, res: Response): Response => {
  return res.status(404).json("Page Not Found");
});

// User-defined typing
interface ServerError {
  log: string;
  status: number;
  message: { err: string };
}

//Global error handler
app.use(
  (
    err: ServerError,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
  ): Response => {
    const defaultErr: ServerError = {
      log: "Express error handler caught unknown middleware error",
      status: 500,
      message: { err: "An error occurred" },
    };
    const errorObj: ServerError = Object.assign({}, defaultErr, err);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

// --------

// Vite client app dev server: front-end html + React bundle --> port 8080 in dev mode (set in package.json config)
// Express backend dev server:  provides API data --> port 3000 in dev mode (set in package.json config)
// Prod mode:  Everything served off of single port 3000 in prod mode
app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `EXPRESS SERVER RUNNING IN DEV MODE ON port ${PORT} & APP ON port ${process.env.npm_package_config_vite_app_server_port} at 'http://localhost:${process.env.npm_package_config_vite_app_server_port}/' ... `
    );
  }
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "production"
  ) {
    console.log(
      `EXPRESS SERVER RUNNING IN DEV MODE ON port ${PORT} at 'http://localhost:${PORT}' ... `
    );
  }
});
