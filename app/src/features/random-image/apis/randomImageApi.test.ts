import * as randomImageApi from "./randomImageApi"; // ★モジュール全体をimport
import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.all("/api/random-image", randomImageApi.randomImageHandler);

describe("randomImageHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("POSTで正常に画像URLを返す", async () => {
    // モジュールオブジェクトとプロパティ名を指定する

    const res = await request(app).post("/api/random-image").send({});

    expect(res.status).toBe(200);
    expect(res.body.imageUrl).contain("picsum.photos");
  });
});
