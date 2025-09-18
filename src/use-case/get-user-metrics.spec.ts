import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository'

let checkInRepository: InMemoryCheckInRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should be able to get user check-ins count from metrics', async () => {
    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })

    expect(checkInsCount).toEqual(2)
  })
})
