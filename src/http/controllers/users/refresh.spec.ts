import { expect, describe, test, beforeAll, afterAll } from "vitest";
import { app } from "@/app";
import request from "supertest";

describe("Refresh (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to refresh", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "john.doe@example.com",
      password: "123456",
    });

    const cookies = response.get("Set-Cookie") ?? [];

    const responseRefresh = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(responseRefresh.statusCode).toBe(200);
    expect(responseRefresh.body).toEqual({
      token: expect.any(String),
    });
    expect(responseRefresh.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
