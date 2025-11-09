import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("History check-ins (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to list check-ins history", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "Gym 1",
        description: "Gym 1 description",
        phone: "1234567890",
        latitude: -23.55052,
        longitude: -46.63332,
      },
    });

    const checkIns = await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get("/check-ins")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.checkIns).toHaveLength(2);
    expect(response.body.checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gym_id: gym.id,
          user_id: user.id,
        }),
        expect.objectContaining({
          gym_id: gym.id,
          user_id: user.id,
        }),
      ])
    );
  });
});
