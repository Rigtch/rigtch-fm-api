import { Test, TestingModule } from '@nestjs/testing'
import { paginate } from 'nestjs-typeorm-paginate'
import { Job, Queue } from 'bull'
import { getQueueToken } from '@nestjs/bull'
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended'

import { UsersRepository } from '../users.repository'
import { User } from '../user.entity'

import { UsersHistoryController } from './users-history.controller'

import {
  HistoryTracksRepository,
  historyTracksOrder,
} from '@modules/history/tracks'
import {
  generatePaginatedResponseFactoryMock,
  paginatedResponseMockImplementation,
  trackEntityMock,
  userMock,
} from '@common/mocks'
import { tracksRelations } from '@modules/items/tracks'
import { HISTORY_QUEUE, SYNCHRONIZE_JOB } from '@modules/history/constants'

vi.mock('nestjs-typeorm-paginate')

describe('UsersHistoryController', () => {
  let moduleRef: TestingModule
  let usersHistoryController: UsersHistoryController
  let historyTracksRepository: HistoryTracksRepository
  let historyQueue: Queue<User>
  let synchronizeJobMock: DeepMockProxy<Job<User>>

  beforeEach(async () => {
    synchronizeJobMock = mockDeep<Job<User>>({
      finished: vi.fn(),
    })

    moduleRef = await Test.createTestingModule({
      providers: [
        UsersHistoryController,
        {
          provide: HistoryTracksRepository,
          useValue: {},
        },
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
        {
          provide: getQueueToken(HISTORY_QUEUE),
          useValue: {
            add: vi.fn().mockResolvedValue(synchronizeJobMock),
          },
        },
      ],
    }).compile()

    usersHistoryController = moduleRef.get(UsersHistoryController)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    historyQueue = moduleRef.get(getQueueToken(HISTORY_QUEUE))
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(usersHistoryController).toBeDefined()
  })

  describe('getHistory', () => {
    const id = userMock.id
    const item = {
      track: trackEntityMock,
      playedAt: new Date(),
    }
    const paginateSpy = vi
      .mocked(paginate)
      .mockImplementation(paginatedResponseMockImplementation(item))

    test('should get paginated history', async () => {
      const paginatedResponseMock = generatePaginatedResponseFactoryMock(item)

      const response = await usersHistoryController.getHistory(userMock, '', {})

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(
        historyTracksRepository,
        {
          limit: 10,
          page: 1,
        },
        {
          where: {
            user: {
              id,
            },
          },
          relations: {
            track: tracksRelations,
          },
          order: historyTracksOrder,
        }
      )
    })

    test('should get paginated history with limit', async () => {
      const limit = 50

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        item,
        50
      )

      const response = await usersHistoryController.getHistory(userMock, '', {
        limit,
      })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(limit)
      expect(paginateSpy).toHaveBeenCalledWith(
        historyTracksRepository,
        {
          limit,
          page: 1,
        },
        {
          where: {
            user: {
              id,
            },
          },
          relations: {
            track: tracksRelations,
          },
          order: historyTracksOrder,
        }
      )
    })

    test('should get paginated history with page', async () => {
      const page = 2

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        item,
        undefined,
        2
      )

      const response = await usersHistoryController.getHistory(userMock, '', {
        page,
      })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(
        historyTracksRepository,
        {
          limit: 10,
          page,
        },
        {
          where: {
            user: {
              id,
            },
          },
          relations: {
            track: tracksRelations,
          },
          order: historyTracksOrder,
        }
      )
    })

    test('should synchronize history before getting it', async () => {
      const synchronizeSpy = vi.spyOn(historyQueue, 'add')
      const finishedSpy = vi.spyOn(synchronizeJobMock, 'finished')

      await usersHistoryController.getHistory(userMock, '', {})

      expect(synchronizeSpy).toHaveBeenCalledWith(SYNCHRONIZE_JOB, userMock)
      expect(finishedSpy).toHaveBeenCalled()
    })
  })
})
