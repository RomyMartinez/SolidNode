import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe("Fetch nearby gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to fetch nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 1",
        description: "Gym 1 description",
        phone: "1234567890",
        latitude: -23.55052,
        longitude: -46.63332,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 2",
        description: "Gym 2 description",
        phone: "1234567890",
        latitude: -23.550522,
        longitude: -46.633322,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -23.55052,
        longitude: -46.63332,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(2);
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Gym 1",
        }),
      ])
    );
  });
});
