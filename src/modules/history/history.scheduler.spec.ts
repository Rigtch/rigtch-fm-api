import { SchedulerRegistry } from '@nestjs/schedule'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'

import { HistoryScheduler } from './history.scheduler'
import { HistoryService } from './history.service'

import { UsersRepository } from '@modules/users'
import { userMock, usersMock } from '@common/mocks'

describe('HistoryScheduler', () => {
  let moduleRef: TestingModule
  let historyScheduler: HistoryScheduler
  let usersRepository: UsersRepository
  let historyService: HistoryService
  let schedulerRegistry: SchedulerRegistry

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
          provide: HistoryService,
          useValue: {
            synchronize: vi.fn(),
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
    historyService = moduleRef.get(HistoryService)
    schedulerRegistry = moduleRef.get(SchedulerRegistry)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyScheduler).toBeDefined()
  })

  test('should schedule history synchronization for users in onModuleInit', async () => {
    const findUsersSpy = vi
      .spyOn(usersRepository, 'findUsers')
      .mockResolvedValue(usersMock)
    const triggerFetchingUserHistorySpy = vi
      .spyOn(historyScheduler, 'triggerUserHistorySynchronization')
      .mockResolvedValue()

    await historyScheduler.onModuleInit()

    expect(findUsersSpy).toHaveBeenCalledWith()
    expect(triggerFetchingUserHistorySpy).toHaveBeenCalledTimes(
      usersMock.length
    )
  })

  test('should trigger user history synchronization', () => {
    vi.spyOn(historyScheduler, 'synchronizeUserHistory')
    const addIntervalSpy = vi.spyOn(schedulerRegistry, 'addInterval')

    historyScheduler.triggerUserHistorySynchronization(userMock)

    expect(addIntervalSpy).toHaveBeenCalledWith(
      `fetch-history-${userMock.id}`,
      expect.anything()
    )
  })

  test('should synchronize user history', async () => {
    const synchronize = vi.spyOn(historyService, 'synchronize')

    await historyScheduler.synchronizeUserHistory(userMock)

    expect(synchronize).toHaveBeenCalledWith(userMock)
  })
})
