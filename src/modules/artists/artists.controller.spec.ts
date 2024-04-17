import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { MockInstance } from 'vitest'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'

import { ArtistsController } from './artists.controller'
import { ArtistsRepository } from './artists.repository'
import { Artist } from './artist.entity'

import {
  artistEntityMock,
  createQueryBuilderFactoryMock,
  generatePaginatedResponseFactoryMock,
  trackEntityMock,
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
            findArtistByName: vi.fn(),
            findArtistById: vi.fn(),
            findArtistByExternalId: vi.fn(),
            findOrCreateArtists: vi.fn(),
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
    let findArtistByExternalIdSpy: MockInstance
    let findArtistByNameSpy: MockInstance

    beforeEach(() => {
      findArtistByNameSpy = vi.spyOn(artistsRepository, 'findArtistByName')
      findArtistByExternalIdSpy = vi.spyOn(
        artistsRepository,
        'findArtistByExternalId'
      )
    })

    describe('Pagination', () => {
      const paginateSpy = vi
        .mocked(paginate)
        .mockImplementation((_, { limit, page }: IPaginationOptions) => {
          return Promise.resolve(
            generatePaginatedResponseFactoryMock(trackEntityMock, +limit, +page)
          )
        })

      test('should get paginated artists', async () => {
        const paginatedResponseMock =
          generatePaginatedResponseFactoryMock(trackEntityMock)

        const response = (await artistsController.getArtists(
          {}
        )) as Pagination<Artist>

        expect(response).toEqual(paginatedResponseMock)
        expect(response.items.length).toEqual(10)
        expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
          limit: 10,
          page: 1,
        })
        expect(findArtistByNameSpy).not.toHaveBeenCalled()
        expect(findArtistByExternalIdSpy).not.toHaveBeenCalled()
      })

      test('should get paginated artists with limit', async () => {
        const limit = 50

        const paginatedResponseMock = generatePaginatedResponseFactoryMock(
          trackEntityMock,
          50
        )

        const response = (await artistsController.getArtists({
          limit,
        })) as Pagination<Artist>

        expect(response).toEqual(paginatedResponseMock)
        expect(response.items.length).toEqual(50)
        expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
          limit: 50,
          page: 1,
        })
        expect(findArtistByNameSpy).not.toHaveBeenCalled()
        expect(findArtistByExternalIdSpy).not.toHaveBeenCalled()
      })

      test('should get paginated artists with page', async () => {
        const page = 2

        const paginatedResponseMock = generatePaginatedResponseFactoryMock(
          trackEntityMock,
          10,
          2
        )

        const response = (await artistsController.getArtists({
          page,
        })) as Pagination<Artist>

        expect(response).toEqual(paginatedResponseMock)
        expect(response.items.length).toEqual(10)
        expect(paginateSpy).toHaveBeenCalledWith(queryBuilderMock(), {
          limit: 10,
          page: 2,
        })
        expect(findArtistByNameSpy).not.toHaveBeenCalled()
        expect(findArtistByExternalIdSpy).not.toHaveBeenCalled()
      })
    })

    describe('By Name', () => {
      const name = 'name'

      test('should get artist by name', async () => {
        findArtistByNameSpy.mockResolvedValue(artistEntityMock)

        expect(await artistsController.getArtists({}, name)).toEqual(
          artistEntityMock
        )
        expect(findArtistByNameSpy).toHaveBeenCalledWith(name)
      })

      test('should throw not found exception', async () => {
        findArtistByNameSpy.mockResolvedValue(null)

        await expect(
          artistsController.getArtists({}, name)
        ).rejects.toThrowError(NotFoundException)
        expect(findArtistByNameSpy).toHaveBeenCalledWith(name)
      })
    })

    describe('By ExternalId', () => {
      const externalId = 'externalId'

      test('should get artist by externalId', async () => {
        findArtistByExternalIdSpy.mockResolvedValue(artistEntityMock)

        expect(
          await artistsController.getArtists({}, undefined, externalId)
        ).toEqual(artistEntityMock)
        expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(externalId)
      })

      test('should throw not found exception', async () => {
        findArtistByExternalIdSpy.mockResolvedValue(null)

        await expect(
          artistsController.getArtists({}, undefined, externalId)
        ).rejects.toThrowError(NotFoundException)
        expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(externalId)
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
