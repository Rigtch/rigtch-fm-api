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
            findAlbumByName: vi.fn(),
            findAlbumByExternalId: vi.fn(),
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
      const findAlbumByNameSpy = vi.spyOn(albumsRepository, 'findAlbumByName')
      const findAlbumByExternalIdSpy = vi.spyOn(
        albumsRepository,
        'findAlbumByExternalId'
      )

      expect(await albumsController.getAlbums()).toEqual(albumsEntitiesMock)
      expect(findAlbumsSpy).toHaveBeenCalledWith()
      expect(findAlbumByNameSpy).not.toHaveBeenCalled()
      expect(findAlbumByExternalIdSpy).not.toHaveBeenCalled()
    })

    describe('By Name', () => {
      const name = 'name'

      test('should get album', async () => {
        const findAlbumsSpy = vi.spyOn(albumsRepository, 'findAlbums')
        const findAlbumByNameSpy = vi
          .spyOn(albumsRepository, 'findAlbumByName')
          .mockResolvedValue(albumEntityMock)
        const findAlbumByExternalIdSpy = vi.spyOn(
          albumsRepository,
          'findAlbumByExternalId'
        )

        expect(await albumsController.getAlbums(name)).toEqual(albumEntityMock)
        expect(findAlbumByNameSpy).toHaveBeenCalledWith(name)
        expect(findAlbumsSpy).not.toHaveBeenCalled()
        expect(findAlbumByExternalIdSpy).not.toHaveBeenCalled()
      })

      test('should not get album because it does not found', async () => {
        const findAlbumsSpy = vi.spyOn(albumsRepository, 'findAlbums')
        const findAlbumByNameSpy = vi
          .spyOn(albumsRepository, 'findAlbumByName')
          .mockResolvedValue(null)
        const findAlbumByExternalIdSpy = vi.spyOn(
          albumsRepository,
          'findAlbumByExternalId'
        )

        await expect(albumsController.getAlbums(name)).rejects.toThrowError(
          NotFoundException
        )
        expect(findAlbumByNameSpy).toHaveBeenCalledWith(name)
        expect(findAlbumsSpy).not.toHaveBeenCalled()
        expect(findAlbumByExternalIdSpy).not.toHaveBeenCalled()
      })
    })

    describe('By ExternalId', () => {
      const externalId = 'externalId'

      test('should get album', async () => {
        const findAlbumsSpy = vi.spyOn(albumsRepository, 'findAlbums')
        const findAlbumByNameSpy = vi.spyOn(albumsRepository, 'findAlbumByName')
        const findAlbumByExternalIdSpy = vi
          .spyOn(albumsRepository, 'findAlbumByExternalId')
          .mockResolvedValue(albumEntityMock)

        expect(await albumsController.getAlbums(undefined, externalId)).toEqual(
          albumEntityMock
        )
        expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
        expect(findAlbumsSpy).not.toHaveBeenCalled()
        expect(findAlbumByNameSpy).not.toHaveBeenCalled()
      })

      test('should not get album because it does not found', async () => {
        const findAlbumsSpy = vi.spyOn(albumsRepository, 'findAlbums')
        const findAlbumByNameSpy = vi.spyOn(albumsRepository, 'findAlbumByName')
        const findAlbumByExternalIdSpy = vi
          .spyOn(albumsRepository, 'findAlbumByExternalId')
          .mockResolvedValue(null)

        await expect(
          albumsController.getAlbums(undefined, externalId)
        ).rejects.toThrowError(NotFoundException)
        expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
        expect(findAlbumsSpy).not.toHaveBeenCalled()
        expect(findAlbumByNameSpy).not.toHaveBeenCalled()
      })
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

    test('should not get album because it does not found', async () => {
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
