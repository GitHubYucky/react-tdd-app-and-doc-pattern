// src/features/echo/apis/echo-api.test.ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { echoHandler } from "./echo";

const app = express();
app.use(bodyParser.json());
app.all("/api/echo", echoHandler); // すべてのメソッドに対応

describe("API: /api/echo", () => {
  it("messageをそのままechoする", async () => {
    const res = await request(app)
      .post("/api/echo")
      .send({ message: "Hello" });

    expect(res.status).toBe(200);
    expect(res.body.echoed).toBe("Hello");
  });

  it("messageがない場合は400", async () => {
    const res = await request(app)
      .post("/api/echo")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing 'message'");
  });

  it("GETメソッドなら405", async () => {
    const res = await request(app)
      .get("/api/echo");

    expect(res.status).toBe(405);
    expect(res.body.message).toBe("Method not allowed");
  });
});
