import { Test } from '@nestjs/testing'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'

import { UsersHistoryController } from './users-history.controller'

import { HistoryTrack, HistoryTracksRepository } from '@modules/history/tracks'
import {
  createQueryBuilderFactoryMock,
  generatePaginatedResponseFactoryMock,
  trackEntityMock,
} from '@common/mocks'

vi.mock('nestjs-typeorm-paginate')

describe('UsersHistoryController', () => {
  const queryBuilderMock = createQueryBuilderFactoryMock(HistoryTrack)

  let usersHistoryController: UsersHistoryController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: HistoryTracksRepository,
          useValue: {
            createQueryBuilder: queryBuilderMock,
          },
        },
        UsersHistoryController,
      ],
    }).compile()

    usersHistoryController = module.get(UsersHistoryController)
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
      .mockImplementation((_, { limit, page }: IPaginationOptions) => {
        return Promise.resolve(
          generatePaginatedResponseFactoryMock(item, +limit, +page)
        )
      })

    test('should get paginated history', async () => {
      const paginatedResponseMock = generatePaginatedResponseFactoryMock(item)

      const response = await usersHistoryController.getHistory(id, '', {})

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
        limit: 10,
        page: 1,
      })
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
      expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
        limit,
        page: 1,
      })
    })

    test('should get paginated history with page', async () => {
      const page = 2

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        item,
        10,
        2
      )

      const response = await usersHistoryController.getHistory(id, '', {
        page,
      })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
        limit: 10,
        page,
      })
    })
  })
})
