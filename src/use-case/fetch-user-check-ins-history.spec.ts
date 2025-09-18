import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { expect, describe, it, beforeEach } from 'vitest'

let checkInRepository: InMemoryCheckInRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-Ins History Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
  })

  it('should be able to fetch user check-ins history', async () => {
    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${i}`,
      })
    }

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
