import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

import { ArtistsController } from './artists.controller'
import { ArtistsRepository } from './artists.repository'

import { artistEntitiesMock, artistEntityMock } from '@common/mocks'

describe('ArtistsController', () => {
  let artistsController: ArtistsController
  let artistsRepository: ArtistsRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        {
          provide: ArtistsRepository,
          useValue: {
            findArtists: vi.fn(),
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
    test('should get all artists', async () => {
      const findSpy = vi
        .spyOn(artistsRepository, 'findArtists')
        .mockResolvedValue(artistEntitiesMock)
      const findArtistByNameSpy = vi.spyOn(
        artistsRepository,
        'findArtistByName'
      )
      const findArtistByExternalIdSpy = vi.spyOn(
        artistsRepository,
        'findArtistByExternalId'
      )

      expect(await artistsController.getArtists()).toEqual(artistEntitiesMock)
      expect(findSpy).toHaveBeenCalledWith()
      expect(findArtistByNameSpy).not.toHaveBeenCalled()
      expect(findArtistByExternalIdSpy).not.toHaveBeenCalled()
    })

    describe('By Name', () => {
      const name = 'name'

      test('should get artist by name', async () => {
        const findArtistByNameSpy = vi
          .spyOn(artistsRepository, 'findArtistByName')
          .mockResolvedValue(artistEntityMock)

        expect(await artistsController.getArtists(name)).toEqual(
          artistEntityMock
        )
        expect(findArtistByNameSpy).toHaveBeenCalledWith(name)
      })

      test('should not get artist because of not found', async () => {
        const findArtistByNameSpy = vi
          .spyOn(artistsRepository, 'findArtistByName')
          .mockResolvedValue(null)

        await expect(artistsController.getArtists(name)).rejects.toThrowError(
          NotFoundException
        )
        expect(findArtistByNameSpy).toHaveBeenCalledWith(name)
      })
    })

    describe('By ExternalId', () => {
      const externalId = 'externalId'

      test('should get artist by externalId', async () => {
        const findArtistByExternalIdSpy = vi
          .spyOn(artistsRepository, 'findArtistByExternalId')
          .mockResolvedValue(artistEntityMock)

        expect(
          await artistsController.getArtists(undefined, externalId)
        ).toEqual(artistEntityMock)
        expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(externalId)
      })

      test('should not get artist because of not found', async () => {
        const findArtistByExternalIdSpy = vi
          .spyOn(artistsRepository, 'findArtistByExternalId')
          .mockResolvedValue(null)

        await expect(
          artistsController.getArtists(undefined, externalId)
        ).rejects.toThrowError(NotFoundException)
        expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(externalId)
      })
    })
  })

  describe('getArtistById', () => {
    const id = 'id'

    test('should get artist by id', async () => {
      const findArtistByExternalIdSpy = vi
        .spyOn(artistsRepository, 'findArtistByExternalId')
        .mockResolvedValue(artistEntityMock)

      expect(await artistsController.getArtistById(id)).toEqual(
        artistEntityMock
      )
      expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(id)
    })

    test('should not get artist because of not found', async () => {
      const findArtistByExternalIdSpy = vi
        .spyOn(artistsRepository, 'findArtistByExternalId')
        .mockResolvedValue(null)

      await expect(artistsController.getArtistById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(id)
    })
  })
})
