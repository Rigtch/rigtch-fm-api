import { DataSource } from 'typeorm'
import { Test } from '@nestjs/testing'

import { ArtistsRepository } from './artists.repository'

import { ImagesRepository } from '@modules/images'
import { artistEntityMock, artistMock, imagesMock } from '@common/mocks'
import { SpotifyArtistsService } from '@modules/spotify/artists'

describe('ArtistsRepository', () => {
  let artistsRepository: ArtistsRepository
  let imagesRepository: ImagesRepository
  let spotifyArtistsService: SpotifyArtistsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ArtistsRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
        {
          provide: ImagesRepository,
          useValue: {
            findOrCreateImages: vi.fn(),
          },
        },
        {
          provide: SpotifyArtistsService,
          useValue: {
            getArtist: vi.fn(),
          },
        },
      ],
    }).compile()

    artistsRepository = module.get(ArtistsRepository)
    imagesRepository = module.get(ImagesRepository)
    spotifyArtistsService = module.get(SpotifyArtistsService)
  })

  test('should be defined', () => {
    expect(artistsRepository).toBeDefined()
  })

  test('should create artist', async () => {
    const createImageSpy = vi
      .spyOn(imagesRepository, 'findOrCreateImages')
      .mockResolvedValue(imagesMock)
    const createSpy = vi
      .spyOn(artistsRepository, 'create')
      .mockReturnValue(artistEntityMock)
    const saveSpy = vi
      .spyOn(artistsRepository, 'save')
      .mockResolvedValue(artistEntityMock)

    expect(await artistsRepository.createArtist(artistMock)).toEqual(
      artistEntityMock
    )
    expect(createImageSpy).toHaveBeenCalledWith(imagesMock)
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(artistEntityMock)
  })

  describe('findOrCreateArtist', () => {
    test('should find artist', async () => {
      const findOneSpy = vi
        .spyOn(artistsRepository, 'findOne')
        .mockResolvedValue(artistEntityMock)
      const createArtistSpy = vi.spyOn(artistsRepository, 'createArtist')

      expect(await artistsRepository.findOrCreateArtist(artistMock.id)).toEqual(
        artistEntityMock
      )
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { externalId: artistMock.id },
      })
      expect(createArtistSpy).not.toHaveBeenCalled()
    })

    test('should create artist', async () => {
      const findOneSpy = vi
        .spyOn(artistsRepository, 'findOne')
        .mockResolvedValue(null)
      const createArtistSpy = vi
        .spyOn(artistsRepository, 'createArtist')
        .mockResolvedValue(artistEntityMock)
      const getArtistSpy = vi
        .spyOn(spotifyArtistsService, 'getArtist')
        .mockResolvedValue(artistMock)

      expect(await artistsRepository.findOrCreateArtist(artistMock.id)).toEqual(
        artistEntityMock
      )
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { externalId: artistMock.id },
      })
      expect(getArtistSpy).toHaveBeenCalledWith(artistMock.id)
      expect(createArtistSpy).toHaveBeenCalledWith(artistMock)
    })
  })

  test('should find or create artists', async () => {
    const findOrCreateArtistSpy = vi
      .spyOn(artistsRepository, 'findOrCreateArtist')
      .mockResolvedValue(artistEntityMock)

    expect(
      await artistsRepository.findOrCreateArtists([artistMock.id])
    ).toEqual([artistEntityMock])
    expect(findOrCreateArtistSpy).toHaveBeenCalledWith(artistMock.id)
  })
})
