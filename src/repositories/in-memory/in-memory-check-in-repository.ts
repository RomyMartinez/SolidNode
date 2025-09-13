import { CheckInRepository } from "../check-in-repository";
import { CheckIn } from "@/generated/prisma";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInRepository implements CheckInRepository {
  public checkIns: CheckIn[] = [];

  async create(data: CheckIn): Promise<CheckIn> {
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
