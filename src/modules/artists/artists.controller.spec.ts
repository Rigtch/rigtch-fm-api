import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { paginate } from 'nestjs-typeorm-paginate'

import { ArtistsController } from './artists.controller'
import { ArtistsRepository } from './artists.repository'
import { Artist } from './artist.entity'

import {
  artistEntityMock,
  createQueryBuilderFactoryMock,
  generatePaginatedResponseFactoryMock,
  paginatedResponseMockImplementation,
} from '@common/mocks'

vi.mock('nestjs-typeorm-paginate')

describe('ArtistsController', () => {
  const queryBuilderMock = createQueryBuilderFactoryMock(Artist)

  let artistsController: ArtistsController
  let artistsRepository: ArtistsRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        {
          provide: ArtistsRepository,
          useValue: {
            createQueryBuilder: queryBuilderMock,
            findArtistById: vi.fn(),
          },
        },
      ],
    }).compile()

    artistsController = module.get(ArtistsController)
    artistsRepository = module.get(ArtistsRepository)
  })

  test('should be defined', () => {
    expect(artistsController).toBeDefined()
  })

  describe('getArtists', () => {
    const paginateSpy = vi
      .mocked(paginate)
      .mockImplementation(paginatedResponseMockImplementation(artistEntityMock))

    test('should get paginated artists', async () => {
      const paginatedResponseMock =
        generatePaginatedResponseFactoryMock(artistEntityMock)

      const response = await artistsController.getArtists({})

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
        limit: 10,
        page: 1,
      })
    })

    test('should get paginated artists with limit', async () => {
      const limit = 50

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        artistEntityMock,
        50
      )

      const response = await artistsController.getArtists({
        limit,
      })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(50)
      expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
        limit: 50,
        page: 1,
      })
    })

    test('should get paginated artists with page', async () => {
      const page = 2

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        artistEntityMock,
        10,
        2
      )

      const response = await artistsController.getArtists({
        page,
      })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
        limit: 10,
        page: 2,
      })
    })
  })

  describe('getArtistById', () => {
    const id = 'id'

    test('should get artist by id', async () => {
      const findArtistByExternalIdSpy = vi
        .spyOn(artistsRepository, 'findArtistById')
        .mockResolvedValue(artistEntityMock)

      expect(await artistsController.getArtistById(id)).toEqual(
        artistEntityMock
      )
      expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(id)
    })

    test('should throw not found exception', async () => {
      const findArtistByExternalIdSpy = vi
        .spyOn(artistsRepository, 'findArtistById')
        .mockResolvedValue(null)

      await expect(artistsController.getArtistById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(id)
    })
  })
})
