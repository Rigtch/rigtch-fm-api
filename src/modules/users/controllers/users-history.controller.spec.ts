import { Test, TestingModule } from '@nestjs/testing'
import { paginate } from 'nestjs-typeorm-paginate'

import { UsersRepository } from '../users.repository'

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
import { HistoryService } from '@modules/history'

vi.mock('nestjs-typeorm-paginate')

describe('UsersHistoryController', () => {
  let moduleRef: TestingModule
  let usersHistoryController: UsersHistoryController
  let historyTracksRepository: HistoryTracksRepository
  let usersRepository: UsersRepository
  let historyService: HistoryService

  beforeEach(async () => {
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
          provide: HistoryService,
          useValue: {
            synchronize: vi.fn(),
          },
        },
      ],
    }).compile()

    usersHistoryController = moduleRef.get(UsersHistoryController)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    usersRepository = moduleRef.get(UsersRepository)
    historyService = moduleRef.get(HistoryService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(usersHistoryController).toBeDefined()
  })

  describe('getHistory', () => {
    const id = 'id'
    const item = {
      track: trackEntityMock,
      playedAt: new Date(),
    }
    const paginateSpy = vi
      .mocked(paginate)
      .mockImplementation(paginatedResponseMockImplementation(item))

    test('should get paginated history', async () => {
      const paginatedResponseMock = generatePaginatedResponseFactoryMock(item)

      const response = await usersHistoryController.getHistory(id, '', {})

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

      const response = await usersHistoryController.getHistory(id, '', {
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

      const response = await usersHistoryController.getHistory(id, '', {
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
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const synchronizeSpy = vi.spyOn(historyService, 'synchronize')

      await usersHistoryController.getHistory(id, '', {})

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(synchronizeSpy).toHaveBeenCalledWith(userMock)
    })
  })
})
