import { CheckInRepository } from "../check-in-repository";
import { Prisma, CheckIn } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export class PrismaCheckInRepository implements CheckInRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data });
    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        createdAt: { gte: new Date(date.setHours(0, 0, 0, 0)) },
      },
    });
    return checkIn || null;
  }
}
