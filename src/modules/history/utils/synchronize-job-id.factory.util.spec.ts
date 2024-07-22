import { synchronizeJobIdFactory } from './synchronize-job-id.factory.util'

describe('synchronizeJobIdFactory', () => {
  test('should return a job id with timestamp', () => {
    const givenUserId = 'userId'

    const [userId, timestamp] = synchronizeJobIdFactory(givenUserId)
      .split('-')
      .splice(2)

    expect(userId).toBe(givenUserId)
    expect(+timestamp).toBeGreaterThan(0)
  })

  test('should return a job id with repeatable', () => {
    const givenUserId = 'userId'

    const [userId, repeatable] = synchronizeJobIdFactory(givenUserId, true)
      .split('-')
      .splice(2)

    expect(userId).toBe(givenUserId)
    expect(repeatable).toBe('repeatable')
  })
})
