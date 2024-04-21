import { Test, TestingModule } from '@nestjs/testing'
import { paginate } from 'nestjs-typeorm-paginate'

import { UsersHistoryController } from './users-history.controller'

import {
  HistoryTracksRepository,
  historyTracksOrder,
} from '@modules/history/tracks'
import {
  generatePaginatedResponseFactoryMock,
  paginatedResponseMockImplementation,
  trackEntityMock,
} from '@common/mocks'
import { tracksRelations } from '@modules/tracks'

vi.mock('nestjs-typeorm-paginate')

describe('UsersHistoryController', () => {
  let moduleRef: TestingModule
  let usersHistoryController: UsersHistoryController
  let historyTracksRepository: HistoryTracksRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: HistoryTracksRepository,
          useValue: {},
        },
        UsersHistoryController,
      ],
    }).compile()

    usersHistoryController = moduleRef.get(UsersHistoryController)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
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
          relations: {
            track: tracksRelations,
          },
          order: historyTracksOrder,
        }
      )
    })
  })
})
