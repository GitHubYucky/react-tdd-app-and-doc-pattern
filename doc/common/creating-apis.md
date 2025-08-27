# Creating APIs

This document describes the steps to create an API.

1.  **Create a file for the API logic:**

    - Create a new file in the `src/features/[feature]/apis/` directory. This file will contain the logic for your API endpoint.
    - The file name should be descriptive of the API's function (e.g., `src/features/echo/apis/echo.ts` for an echo API).

2.  **Write the API logic:**

    - In the newly created file, write the code that will handle the API request.
    - This typically involves:
      - Importing necessary modules (e.g., `express`, `body-parser`).
      - Defining a handler function that takes a request and response object as arguments.
      - Extracting data from the request (e.g., using `req.body`).
      - Performing the desired operation (e.g., echoing the input, querying a database).
      - Sending a response back to the client (e.g., using `res.send()`, `res.json()`).
    - Example:

      ```typescript
      // src/features/echo/apis/echo.ts
      import { Request, Response } from "express";

      export const echoHandler = (req: Request, res: Response) => {
        const message = req.body.message || "Hello, world!";
        res.json({ echoed: message });
      };
      ```

3.  **Add the API endpoint to `src/server/index.ts`:**

    - In `src/server/index.ts`, import the handler function you created in step 2.
    - Use `app.all()` (or another appropriate method like `app.get()`, `app.post()`, etc.) to define the API endpoint and associate it with the handler function.
    - Example:

      ```typescript
      // src/server/index.ts
      import express from "express";
      import bodyParser from "body-parser";
      import { echoHandler } from "../features/echo/apis/echo";

      const app = express();
      app.use(bodyParser.json());

      app.all("/api/echo", echoHandler);

      const PORT = Number(process.env.PORT) || 3001;
      app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
      });
      ```
