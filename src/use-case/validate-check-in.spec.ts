import { expect, describe, it, beforeEach } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";

describe("Validate Check-in Use Case", () => {
  let checkInRepository: InMemoryCheckInRepository;
  let sut: ValidateCheckInUseCase;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);
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
});
