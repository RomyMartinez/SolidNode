import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check-in Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate a check-in", async () => {
    const checkIn = await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });

    await sut.execute({
      checkInId: checkIn.id,
    });

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
    expect(checkInRepository.checkIns[0].validatedAt).toEqual(expect.any(Date));
  });

  it("should not be able to validate a check-in that does not exist", async () => {
    await expect(
      sut.execute({
        checkInId: "check-in-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate a check-in that was created 20 minutes ago", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0));

    const checkIn = await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });

    const twentyOneMinutesInMs = 21 * 60 * 1000;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(
      sut.execute({
        checkInId: checkIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
