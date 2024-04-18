import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { paginate } from 'nestjs-typeorm-paginate'

import { TracksController } from './tracks.controller'
import { TracksRepository, tracksRelations } from './tracks.repository'

import {
  trackEntityMock,
  generatePaginatedResponseFactoryMock,
  paginatedResponseMockImplementation,
} from '@common/mocks'

vi.mock('nestjs-typeorm-paginate')

describe('TracksController', () => {
  let tracksController: TracksController
  let tracksRepository: TracksRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TracksController],
      providers: [
        {
          provide: TracksRepository,
          useValue: {
            findTrackById: vi.fn(),
          },
        },
      ],
    }).compile()

    tracksController = module.get(TracksController)
    tracksRepository = module.get(TracksRepository)
  })

  test('should be defined', () => {
    expect(tracksController).toBeDefined()
  })

  describe('getTracks', () => {
    const paginateSpy = vi
      .mocked(paginate)
      .mockImplementation(paginatedResponseMockImplementation(trackEntityMock))

    test('should get paginated tracks', async () => {
      const paginatedResponseMock =
        generatePaginatedResponseFactoryMock(trackEntityMock)

      const response = await tracksController.getTracks({})

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(
        tracksRepository,
        {
          limit: 10,
          page: 1,
        },
        {
          relations: tracksRelations,
        }
      )
    })

    test('should get paginated tracks with limit', async () => {
      const limit = 50

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        trackEntityMock,
        limit
      )

      const response = await tracksController.getTracks({ limit })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(limit)
      expect(paginateSpy).toHaveBeenCalledWith(
        tracksRepository,
        {
          limit,
          page: 1,
        },
        {
          relations: tracksRelations,
        }
      )
    })

    test('should get paginated tracks with page', async () => {
      const page = 2

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        trackEntityMock,
        undefined,
        page
      )

      const response = await tracksController.getTracks({ page })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(
        tracksRepository,
        {
          limit: 10,
          page,
        },
        {
          relations: tracksRelations,
        }
      )
    })
  })

  describe('getTrackById', () => {
    const id = 'id'

    test('should get track', async () => {
      const findTrackByIdSpy = vi
        .spyOn(tracksRepository, 'findTrackById')
        .mockResolvedValue(trackEntityMock)

      expect(await tracksController.getTrackById(id)).toEqual(trackEntityMock)
      expect(findTrackByIdSpy).toHaveBeenCalledWith(id)
    })

    test('should throw not found exception', async () => {
      const findTrackByIdSpy = vi
        .spyOn(tracksRepository, 'findTrackById')
        .mockResolvedValue(null)

      await expect(tracksController.getTrackById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(findTrackByIdSpy).toHaveBeenCalledWith(id)
    })
  })
})
