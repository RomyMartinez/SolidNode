import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { CheckInUseCase } from "./check-in";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

beforeEach(() => {
  checkInRepository = new InMemoryCheckInRepository();
  gymsRepository = new InMemoryGymsRepository();
  sut = new CheckInUseCase(checkInRepository, gymsRepository);

  gymsRepository.gyms.push({
    id: "gym-1",
    title: "Gym 1",
    description: "Gym 1",
    phone: "1234567890",
    latitude: new Decimal(0),
    longitude: new Decimal(0),
  });

  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CheckInUseCase", () => {
  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0));

    await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(
      sut.execute({
        userId: "user-1",
        gymId: "gym-1",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in on a distant date", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0));

    await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2025, 0, 2, 10, 0, 0));

    await expect(
      sut.execute({
        userId: "user-1",
        gymId: "gym-1",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).resolves.toBeTruthy();
  });

  it("should not be able to check in on a distant gym", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0));

    await expect(
      sut.execute({
        userId: "user-1",
        gymId: "gym-1",
        userLatitude: 0,
        userLongitude: 0.1,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
