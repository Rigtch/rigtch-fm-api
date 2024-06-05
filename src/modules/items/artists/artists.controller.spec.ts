import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { PaginateQuery } from 'nestjs-paginate'
import { MockInstance } from 'vitest'

import { ArtistsController } from './artists.controller'
import { ArtistsRepository } from './artists.repository'

import {
  artistEntityMock,
  createQueryBuilderFactoryMock,
  createQueryBuilderMockImplementation,
} from '@common/mocks'

describe('ArtistsController', () => {
  let moduleRef: TestingModule
  let artistsController: ArtistsController
  let artistsRepository: ArtistsRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        {
          provide: ArtistsRepository,
          useValue: {
            createQueryBuilder: createQueryBuilderFactoryMock(artistEntityMock),
          },
        },
      ],
    }).compile()

    artistsController = moduleRef.get(ArtistsController)
    artistsRepository = moduleRef.get(ArtistsRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(artistsController).toBeDefined()
  })

  describe('getArtists', () => {
    let paginateQueryMock: PaginateQuery

    beforeEach(() => {
      paginateQueryMock = {
        path: '',
      }
    })

    test('should get paginated artists', async () => {
      const response = await artistsController.getArtists(paginateQueryMock)

      expect(response.data).toEqual(artistEntityMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get paginated artists with limit', async () => {
      const limit = 50

      paginateQueryMock.limit = limit

      const response = await artistsController.getArtists(paginateQueryMock)

      expect(response.data).toEqual(artistEntityMock)
      expect(response.meta.itemsPerPage).toEqual(limit)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get paginated artists with page', async () => {
      const page = 2

      paginateQueryMock.page = page

      const response = await artistsController.getArtists(paginateQueryMock)

      expect(response.data).toEqual(artistEntityMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(page)
    })
  })

  describe('getArtistById', () => {
    const id = 'id'

    let createQueryBuilderSpy: MockInstance

    beforeEach(() => {
      createQueryBuilderSpy = vi.spyOn(artistsRepository, 'createQueryBuilder')
    })

    test('should get artist by id', async () => {
      createQueryBuilderSpy.mockReturnValue(
        createQueryBuilderMockImplementation(artistEntityMock)
      )

      expect(await artistsController.getArtistById(id)).toEqual(
        artistEntityMock
      )
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('artist')
    })

    test('should throw not found exception', async () => {
      createQueryBuilderSpy.mockReturnValue(
        createQueryBuilderMockImplementation(null)
      )

      await expect(artistsController.getArtistById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('artist')
    })
  })
})
