import { CheckInRepository } from '../check-in-repository'
import { Prisma, CheckIn } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'

export class PrismaCheckInRepository implements CheckInRepository {
  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
    return checkIn || null
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })
    return checkIns
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }

  async save(checkInToSave: CheckIn): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: checkInToSave.id,
      },
      data: checkInToSave,
    })
    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data })
    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfTheDay = new Date(date.setHours(23, 59, 59, 999))

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        createdAt: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })
    return checkIn
  }
}
