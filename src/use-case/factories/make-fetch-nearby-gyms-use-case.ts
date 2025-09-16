import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";
import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

export function makeFetchNearbyGymsUseCase() {
  const gymRepository = new PrismaGymRepository();
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymRepository);
  return fetchNearbyGymsUseCase;
}
