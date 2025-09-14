import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Gym 1",
      description: "Gym 1 description",
      phone: "1234567890",
      latitude: 123,
      longitude: 456,
    });

    await gymsRepository.create({
      title: "Gym 2",
      description: "Gym 2 description",
      phone: "1234567890",
      latitude: 123,
      longitude: 456,
    });

    const { gyms } = await sut.execute({ query: "Gym 1", page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Gym 1" })]);
  });

  it("should be able to search for paginated gyms", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Neo Gym ${i}`,
        description: `Gym ${i} description`,
        phone: "1234567890",
        latitude: 123,
        longitude: 456,
      });
    }

    const { gyms } = await sut.execute({ query: "Neo Gym", page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Neo Gym 21" }),
      expect.objectContaining({ title: "Neo Gym 22" }),
    ]);
  });
});
