import { Queue } from 'bullmq'
import { MockInstance } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { getQueueToken } from '@nestjs/bullmq'
import { mock } from 'vitest-mock-extended'

import { HistoryScheduler } from './history.scheduler'
import { HISTORY_QUEUE, SYNCHRONIZE_JOB } from './constants'
import { synchronizeJobIdFactory } from './utils'

import { EnvService } from '@config/env'
import { User, UsersRepository } from '@modules/users'
import { userMock } from '@common/mocks'

describe('HistoryScheduler', () => {
  let moduleRef: TestingModule
  let historyScheduler: HistoryScheduler
  let usersRepository: UsersRepository
  let historyQueue: Queue<User>
  let envService: EnvService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UsersRepository,
          useValue: {
            find: vi.fn(),
          },
        },
        {
          provide: getQueueToken(HISTORY_QUEUE),
          useValue: {
            add: vi.fn(),
            getRepeatableJobs: vi.fn(),
            removeRepeatableByKey: vi.fn(),
          },
        },

        {
          provide: EnvService,
          useValue: {
            get: vi.fn().mockReturnValue('0 */1 * * *'),
          },
        },
        HistoryScheduler,
      ],
    }).compile()

    historyScheduler = moduleRef.get(HistoryScheduler)
    usersRepository = moduleRef.get(UsersRepository)
    historyQueue = moduleRef.get(getQueueToken(HISTORY_QUEUE))
    envService = moduleRef.get(EnvService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyScheduler).toBeDefined()
  })

  describe('onApplicationBootstrap', () => {
    let getConfigSpy: MockInstance
    let scheduleHistorySynchronizationSpy: MockInstance

    beforeEach(() => {
      getConfigSpy = vi.spyOn(envService, 'get')
      scheduleHistorySynchronizationSpy = vi
        .spyOn(historyScheduler, 'scheduleHistorySynchronization')
        .mockResolvedValue()
    })

    test('should not schedule history synchronization if history synchronization is disabled', () => {
      getConfigSpy.mockReturnValue(false)

      historyScheduler.onApplicationBootstrap()

      expect(scheduleHistorySynchronizationSpy).not.toHaveBeenCalled()
    })

    test('should schedule history synchronization', () => {
      getConfigSpy.mockReturnValue(true)

      historyScheduler.onApplicationBootstrap()

      expect(scheduleHistorySynchronizationSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('scheduleHistorySynchronization', () => {
    let findSpy: MockInstance
    let scheduleHistorySynchronizationForUserSpy: MockInstance

    beforeEach(() => {
      findSpy = vi.spyOn(usersRepository, 'find')
      scheduleHistorySynchronizationForUserSpy = vi
        .spyOn(historyScheduler, 'scheduleHistorySynchronizationForUser')
        .mockResolvedValue()
    })

    test('should call `scheduleHistorySynchronizationForUser` for every user', async () => {
      const usersCount = 5

      findSpy.mockResolvedValue(
        Array.from({ length: usersCount }, () => userMock)
      )

      await historyScheduler.scheduleHistorySynchronization()

      expect(findSpy).toHaveBeenCalledTimes(1)
      expect(scheduleHistorySynchronizationForUserSpy).toHaveBeenCalledTimes(
        usersCount
      )
      expect(scheduleHistorySynchronizationForUserSpy).toHaveBeenCalledWith(
        userMock
      )
    })
  })

  describe('scheduleHistorySynchronizationForUser', () => {
    let getRepeatableJobsSpy: MockInstance
    let removeRepeatableByKeySpy: MockInstance
    let addSpy: MockInstance

    beforeEach(() => {
      getRepeatableJobsSpy = vi.spyOn(historyQueue, 'getRepeatableJobs')
      removeRepeatableByKeySpy = vi.spyOn(historyQueue, 'removeRepeatableByKey')
      addSpy = vi.spyOn(historyQueue, 'add')
    })

    test('should remove repeatable job', async () => {
      const jobKey = 'key'
      const userId = 'userId'

      getRepeatableJobsSpy.mockResolvedValue([
        {
          id: synchronizeJobIdFactory(userId, true),
          key: jobKey,
        },
      ])

      await historyScheduler.scheduleHistorySynchronizationForUser(
        mock<User>({
          id: userId,
        })
      )

      expect(getRepeatableJobsSpy).toHaveBeenCalledWith()
      expect(removeRepeatableByKeySpy).toHaveBeenCalledWith(jobKey)
    })

    test('should not remove repeatable job', async () => {
      const jobKey = 'key'
      const userId = 'userId'

      getRepeatableJobsSpy.mockResolvedValue([
        {
          id: synchronizeJobIdFactory(userId),
          key: jobKey,
        },
      ])

      await historyScheduler.scheduleHistorySynchronizationForUser(userMock)

      expect(getRepeatableJobsSpy).toHaveBeenCalledWith()
      expect(removeRepeatableByKeySpy).not.toHaveBeenCalled()
    })

    test('should add repeatable synchronize job to history queue', async () => {
      const userId = 'userId'

      const customUserMock = mock<User>({
        id: userId,
      })

      getRepeatableJobsSpy.mockResolvedValue([])

      await historyScheduler.scheduleHistorySynchronizationForUser(
        customUserMock
      )

      expect(getRepeatableJobsSpy).toHaveBeenCalledWith()
      expect(addSpy).toHaveBeenCalledWith(SYNCHRONIZE_JOB, customUserMock, {
        priority: 1,
        repeat: {
          pattern: expect.any(String),
        },
        attempts: 3,
        jobId: synchronizeJobIdFactory(userId, true),
      })
    })
  })
})
