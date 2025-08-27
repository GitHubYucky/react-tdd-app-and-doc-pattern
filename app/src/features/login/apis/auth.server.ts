// src/features/login/apis/auth.server.ts
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const authHandler = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const COOKIE_NAME = "access_token";
const USERS = [
  { id: 1, email: "demo@example.com", passwordHash: bcrypt.hashSync("password123", 10), name: "Demo User" },
];

const signToken = (payload: object) => jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
const setCookie = (res: Response, token: string) =>
  res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 1000*60*15 });

authHandler.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const user = USERS.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash)))
    return res.status(401).json({ message: "Invalid credentials" });
  setCookie(res, signToken({ sub: user.id, email: user.email, name: user.name }));
  res.json({ ok: true });
});

authHandler.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

authHandler.get("/me", (req, res) => {
  const token = (req as any).cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try { res.json({ user: jwt.verify(token, JWT_SECRET) }); }
  catch { res.status(401).json({ message: "Unauthorized" }); }
});
