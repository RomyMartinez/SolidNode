import { Prisma, CheckIn } from '@/generated/prisma'

export interface CheckInRepository {
  findById(id: string): Promise<CheckIn | null>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  save(checkInToSave: CheckIn): Promise<CheckIn>
}
