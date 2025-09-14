import { CheckInRepository } from "../check-in-repository";
import { CheckIn, Prisma } from "@/generated/prisma";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInRepository implements CheckInRepository {
  public checkIns: CheckIn[] = [];

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async save(checkInToSave: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkIns.findIndex(
      (checkIn) => checkIn.id === checkInToSave.id
    );

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkInToSave;
    }

    return checkInToSave;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      createdAt: new Date(),
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.createdAt);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return isOnSameDate && checkIn.user_id === userId;
    });

    if (!checkOnSameDate) {
      return null;
    }

    return checkOnSameDate;
  }
}
