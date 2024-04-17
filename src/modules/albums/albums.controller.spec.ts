import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

import { AlbumsController } from './albums.controller'
import { AlbumsRepository } from './albums.repository'

import { albumEntityMock, albumsEntitiesMock } from '@common/mocks'

describe('AlbumsController', () => {
  let albumsController: AlbumsController
  let albumsRepository: AlbumsRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [
        {
          provide: AlbumsRepository,
          useValue: {
            findAlbums: vi.fn(),
            findAlbumById: vi.fn(),
          },
        },
      ],
    }).compile()

    albumsController = module.get(AlbumsController)
    albumsRepository = module.get(AlbumsRepository)
  })

  test('should be defined', () => {
    expect(albumsController).toBeDefined()
  })

  describe('getAlbums', () => {
    test('should get all albums', async () => {
      const findAlbumsSpy = vi
        .spyOn(albumsRepository, 'findAlbums')
        .mockResolvedValue(albumsEntitiesMock)

      expect(await albumsController.getAlbums()).toEqual(albumsEntitiesMock)
      expect(findAlbumsSpy).toHaveBeenCalledWith()
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
