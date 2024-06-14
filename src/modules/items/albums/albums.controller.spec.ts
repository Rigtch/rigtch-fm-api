import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { PaginateQuery } from 'nestjs-paginate'
import { MockInstance } from 'vitest'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { AlbumsController } from './albums.controller'
import { AlbumsRepository } from './albums.repository'

import {
  albumEntityMock,
  createQueryBuilderFactoryMock,
  createQueryBuilderMockImplementation,
} from '@common/mocks'

describe('AlbumsController', () => {
  let moduleRef: TestingModule
  let albumsController: AlbumsController
  let albumsRepository: AlbumsRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [
        {
          provide: AlbumsRepository,
          useValue: {
            createQueryBuilder: createQueryBuilderFactoryMock(albumEntityMock),
          },
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: vi.fn(),
      })
      .compile()

    albumsController = moduleRef.get(AlbumsController)
    albumsRepository = moduleRef.get(AlbumsRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(albumsController).toBeDefined()
  })

  describe('getAlbums', () => {
    let paginateQueryMock: PaginateQuery

    beforeEach(() => {
      paginateQueryMock = {
        path: '',
      }
    })

    test('should get all albums', async () => {
      const response = await albumsController.getAlbums(paginateQueryMock)

      expect(response.data).toEqual(albumEntityMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get all albums with limit', async () => {
      const limit = 50

      paginateQueryMock.limit = limit

      const response = await albumsController.getAlbums(paginateQueryMock)

      expect(response.data).toEqual(albumEntityMock)
      expect(response.meta.itemsPerPage).toEqual(limit)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get all albums with page', async () => {
      const page = 2

      paginateQueryMock.page = page

      const response = await albumsController.getAlbums(paginateQueryMock)

      expect(response.data).toEqual(albumEntityMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(page)
    })
  })

  describe('getAlbumById', () => {
    const id = 'id'

    let createQueryBuilderSpy: MockInstance

    beforeEach(() => {
      createQueryBuilderSpy = vi.spyOn(albumsRepository, 'createQueryBuilder')
    })

    test('should get album', async () => {
      createQueryBuilderSpy.mockReturnValue(
        createQueryBuilderMockImplementation(albumEntityMock)
      )

      expect(await albumsController.getAlbumById(id)).toEqual(albumEntityMock)
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('album')
    })

    test('should throw not found exception', async () => {
      createQueryBuilderSpy.mockReturnValue(
        createQueryBuilderMockImplementation(null)
      )

      await expect(albumsController.getAlbumById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('album')
    })
  })
})
