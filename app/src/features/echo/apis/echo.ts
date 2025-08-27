// src/features/echo/apis/echo-api.ts
import type { Request, Response } from "express";

export const echoHandler = (req: Request, res: Response) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ message: "Missing 'message'" });
  }

``
  return res.status(200).json({ echoed: message });
};
