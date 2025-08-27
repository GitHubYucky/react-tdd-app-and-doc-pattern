// src/features/mp3/apis/mp3.ts
import type { Request, Response } from "express";
import fetch from "node-fetch";


debugger;
export const mp3Handler = async (req: Request, res: Response) => {
  try {
    const id = (req.query.id ?? "").toString().trim();
    if (!id) {
      return res.status(400).json({ ok: false, error: "missing id" });
    }
    // if (!process.env.RAPIDAPI_KEY) {
    //   return res.status(500).json({ ok: false, error: "server misconfigured: RAPIDAPI_KEY" });
    // }

    const url = `${process.env.RAPID_BASE}/dl?id=${encodeURIComponent(id)}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY??"no-api-key",
        "x-rapidapi-host": process.env.RAPID_HOST??"no-api-host",
      },
    });

    // RapidAPI 側のステータスを尊重して返す
    const data = await resp.json().catch(() => ({}));
    return res.status(resp.status).json(data);
  } catch (err) {
    console.error("[/api/mp3] error:", err);
    return res.status(500).json({ ok: false, error: "unexpected server error" });
  }
};
