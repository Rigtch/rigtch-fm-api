import { synchronizeJobIdFactory } from './synchronize-job-id.factory.util'

describe('synchronizeJobIdFactory', () => {
  test('should return a job id', () => {
    const givenUserId = 'userId'

    const [userId, timestamp] = synchronizeJobIdFactory(givenUserId)
      .split('-')
      .splice(2)

    expect(userId).toBe(givenUserId)
    expect(+timestamp).toBeGreaterThan(0)
  })
})
