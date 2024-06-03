import { Queue } from 'bull'
import { MockInstance } from 'vitest'
import { SchedulerRegistry } from '@nestjs/schedule'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { getQueueToken } from '@nestjs/bull'

import { HistoryScheduler } from './history.scheduler'
import { HISTORY_QUEUE } from './constants'

import { User, UsersRepository } from '@modules/users'
import { usersMock } from '@common/mocks'

describe('HistoryScheduler', () => {
  let moduleRef: TestingModule
  let historyScheduler: HistoryScheduler
  let usersRepository: UsersRepository
  let historyQueue: Queue<User>
  let schedulerRegistry: SchedulerRegistry
  let configService: ConfigService

  beforeEach(async () => {
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(((
      callback: () => void
    ) => {
      callback()
    }) as unknown as typeof setTimeout)

    moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UsersRepository,
          useValue: {
            findUsers: vi.fn(),
          },
        },
        {
          provide: getQueueToken(HISTORY_QUEUE),
          useValue: {
            add: vi.fn(),
          },
        },
        {
          provide: SchedulerRegistry,
          useValue: {
            addInterval: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('1m'),
          },
        },
        HistoryScheduler,
      ],
    }).compile()

    historyScheduler = moduleRef.get(HistoryScheduler)
    usersRepository = moduleRef.get(UsersRepository)
    historyQueue = moduleRef.get(getQueueToken(HISTORY_QUEUE))
    schedulerRegistry = moduleRef.get(SchedulerRegistry)
    configService = moduleRef.get(ConfigService)
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
    let addIntervalSpy: MockInstance

    beforeEach(() => {
      getConfigSpy = vi.spyOn(configService, 'get')
      scheduleHistorySynchronizationSpy = vi
        .spyOn(historyScheduler, 'scheduleHistorySynchronization')
        .mockResolvedValue()
      addIntervalSpy = vi.spyOn(schedulerRegistry, 'addInterval')
    })

    test('should not schedule history synchronization if history synchronization is disabled', () => {
      getConfigSpy.mockReturnValue(false)

      historyScheduler.onApplicationBootstrap()

      expect(scheduleHistorySynchronizationSpy).not.toHaveBeenCalled()
      expect(addIntervalSpy).not.toHaveBeenCalled()
    })

    test('should schedule history synchronization', () => {
      historyScheduler.onApplicationBootstrap()

      expect(scheduleHistorySynchronizationSpy).toHaveBeenCalledTimes(1)
      expect(addIntervalSpy).toHaveBeenCalledWith(
        'history-synchronization',
        expect.anything()
      )
    })
  })

  describe('scheduleHistorySynchronization', () => {
    let findUsersSpy: MockInstance
    let addSpy: MockInstance

    beforeEach(() => {
      findUsersSpy = vi.spyOn(usersRepository, 'findUsers')
      addSpy = vi.spyOn(historyQueue, 'add')
    })

    test('should add synchronize jobs to queue', async () => {
      findUsersSpy.mockResolvedValue(usersMock)

      await historyScheduler.scheduleHistorySynchronization()

      expect(findUsersSpy).toHaveBeenCalledTimes(1)
      expect(addSpy).toHaveBeenCalledTimes(usersMock.length)
    })
  })
})
