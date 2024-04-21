import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { paginate } from 'nestjs-typeorm-paginate'

import { AlbumsController } from './albums.controller'
import {
  AlbumsRepository,
  albumsSimplifiedRelations,
} from './albums.repository'

import {
  albumEntityMock,
  generatePaginatedResponseFactoryMock,
  paginatedResponseMockImplementation,
} from '@common/mocks'

vi.mock('nestjs-typeorm-paginate')

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
            findAlbumById: vi.fn(),
          },
        },
      ],
    }).compile()

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
    const paginateSpy = vi
      .mocked(paginate)
      .mockImplementation(paginatedResponseMockImplementation(albumEntityMock))

    test('should get all albums', async () => {
      const paginatedResponseMock =
        generatePaginatedResponseFactoryMock(albumEntityMock)

      const response = await albumsController.getAlbums({})

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(
        albumsRepository,
        {
          limit: 10,
          page: 1,
        },
        {
          relations: albumsSimplifiedRelations,
        }
      )
    })

    test('should get all albums with limit', async () => {
      const limit = 50

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        albumEntityMock,
        limit
      )

      const response = await albumsController.getAlbums({ limit })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(limit)
      expect(paginateSpy).toHaveBeenCalledWith(
        albumsRepository,
        {
          limit,
          page: 1,
        },
        {
          relations: albumsSimplifiedRelations,
        }
      )
    })

    test('should get all albums with page', async () => {
      const page = 2

      const paginatedResponseMock = generatePaginatedResponseFactoryMock(
        albumEntityMock,
        undefined,
        page
      )

      const response = await albumsController.getAlbums({ page })

      expect(response).toEqual(paginatedResponseMock)
      expect(response.items.length).toEqual(10)
      expect(paginateSpy).toHaveBeenCalledWith(
        albumsRepository,
        {
          limit: 10,
          page,
        },
        {
          relations: albumsSimplifiedRelations,
        }
      )
    })
  })

  describe('getAlbumById', () => {
    const id = 'id'

    test('should get album', async () => {
      const findAlbumByIdSpy = vi
        .spyOn(albumsRepository, 'findAlbumById')
        .mockResolvedValue(albumEntityMock)

      expect(await albumsController.getAlbumById(id)).toEqual(albumEntityMock)
      expect(findAlbumByIdSpy).toHaveBeenCalledWith(id)
    })

    test('should throw not found exception', async () => {
      const findAlbumByIdSpy = vi
        .spyOn(albumsRepository, 'findAlbumById')
        .mockResolvedValue(null)

      await expect(albumsController.getAlbumById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(findAlbumByIdSpy).toHaveBeenCalledWith(id)
    })
  })
})
