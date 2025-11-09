import { expect, describe, test, beforeAll, afterAll } from "vitest";
import { app } from "@/app";
import request from "supertest";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
  });
});
