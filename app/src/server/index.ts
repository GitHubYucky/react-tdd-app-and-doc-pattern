// src/server/index.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import type { CorsOptionsDelegate } from "cors";

import { echoHandler } from "../features/echo/apis/echo";
import { mp3Handler } from "../features/mp3-downloader/apis/mp3";
import { authHandler } from "../features/login/apis/auth.server";

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());


// 既存API
app.all("/api/echo", echoHandler);
app.all("/api/mp3", mp3Handler);
app.use("/api", authHandler);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
