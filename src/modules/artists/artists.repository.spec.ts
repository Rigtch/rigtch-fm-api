import { DataSource, In } from 'typeorm'
import { Test } from '@nestjs/testing'

import { ArtistsRepository } from './artists.repository'

import { ImagesRepository } from '@modules/images'
import {
  artistEntitiesMock,
  artistEntityMock,
  artistMock,
  imagesMock,
  sdkArtistMock,
  sdkArtistsMock,
} from '@common/mocks'
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
            getArtists: vi.fn(),
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

  test('should find artist by external id', async () => {
    const findOneSpy = vi
      .spyOn(artistsRepository, 'findOne')
      .mockResolvedValue(artistEntityMock)

    expect(
      await artistsRepository.findArtistByExternalId(artistMock.id)
    ).toEqual(artistEntityMock)
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { externalId: artistMock.id },
    })
  })

  test('should find artist by id', async () => {
    const findOneSpy = vi
      .spyOn(artistsRepository, 'findOne')
      .mockResolvedValue(artistEntityMock)

    expect(await artistsRepository.findArtistById(artistMock.id)).toEqual(
      artistEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { id: artistMock.id },
    })
  })

  test('should find artist by name', async () => {
    const findOneSpy = vi
      .spyOn(artistsRepository, 'findOne')
      .mockResolvedValue(artistEntityMock)

    expect(await artistsRepository.findArtistByName(artistMock.name)).toEqual(
      artistEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { name: artistMock.name },
    })
  })

  test('should find artists by external ids', async () => {
    const findSpy = vi
      .spyOn(artistsRepository, 'find')
      .mockResolvedValue(artistEntitiesMock)

    expect(
      await artistsRepository.findArtistsByExternalIds([artistMock.id])
    ).toEqual(artistEntitiesMock)
    expect(findSpy).toHaveBeenCalledWith({
      where: { externalId: In([artistMock.id]) },
    })
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

    expect(await artistsRepository.createArtist(sdkArtistMock)).toEqual(
      artistEntityMock
    )
    expect(createImageSpy).toHaveBeenCalledWith(imagesMock)
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(artistEntityMock)
  })

  describe('findOrCreateArtist', () => {
    test('should find artist', async () => {
      const findArtistByExternalId = vi
        .spyOn(artistsRepository, 'findArtistByExternalId')
        .mockResolvedValue(artistEntityMock)
      const createArtistSpy = vi.spyOn(artistsRepository, 'createArtist')

      expect(await artistsRepository.findOrCreateArtist(sdkArtistMock)).toEqual(
        artistEntityMock
      )
      expect(findArtistByExternalId).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(createArtistSpy).not.toHaveBeenCalled()
    })

    test('should create artist', async () => {
      const findArtistByExternalId = vi
        .spyOn(artistsRepository, 'findArtistByExternalId')
        .mockResolvedValue(null)
      const createArtistSpy = vi
        .spyOn(artistsRepository, 'createArtist')
        .mockResolvedValue(artistEntityMock)

      expect(await artistsRepository.findOrCreateArtist(sdkArtistMock)).toEqual(
        artistEntityMock
      )
      expect(findArtistByExternalId).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(createArtistSpy).toHaveBeenCalledWith(sdkArtistMock)
    })
  })

  test('should find or create artists', async () => {
    const findOrCreateArtistSpy = vi
      .spyOn(artistsRepository, 'findOrCreateArtist')
      .mockResolvedValue(artistEntityMock)

    expect(await artistsRepository.findOrCreateArtists(sdkArtistsMock)).toEqual(
      artistEntitiesMock
    )
    expect(findOrCreateArtistSpy).toHaveBeenCalledWith(sdkArtistMock)
  })

  describe('findOrCreateArtistByExternalId', () => {
    test('should find artist by id', async () => {
      const findArtistByExternalId = vi
        .spyOn(artistsRepository, 'findArtistByExternalId')
        .mockResolvedValue(artistEntityMock)
      const getArtistSpy = vi
        .spyOn(spotifyArtistsService, 'getArtist')
        .mockResolvedValue(sdkArtistMock)
      const createArtistSpy = vi.spyOn(artistsRepository, 'createArtist')

      expect(
        await artistsRepository.findOrCreateArtistFromExternalId(
          sdkArtistMock.id
        )
      ).toEqual(artistEntityMock)
      expect(findArtistByExternalId).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(getArtistSpy).not.toHaveBeenCalled()
      expect(createArtistSpy).not.toHaveBeenCalled()
    })

    test('should create artist by id', async () => {
      const findArtistByExternalId = vi
        .spyOn(artistsRepository, 'findArtistByExternalId')
        .mockResolvedValue(null)
      const getArtistSpy = vi
        .spyOn(spotifyArtistsService, 'getArtist')
        .mockResolvedValue(sdkArtistMock)
      const createArtistSpy = vi
        .spyOn(artistsRepository, 'createArtist')
        .mockResolvedValue(artistEntityMock)

      expect(
        await artistsRepository.findOrCreateArtistFromExternalId(
          sdkArtistMock.id
        )
      ).toEqual(artistEntityMock)
      expect(findArtistByExternalId).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(getArtistSpy).toHaveBeenCalledWith(sdkArtistMock.id, false)
      expect(createArtistSpy).toHaveBeenCalledWith(sdkArtistMock)
    })
  })

  describe('findOrCreateArtistsByExternalIds', () => {
    const ids = sdkArtistsMock.map(artist => artist.id)

    test('should find artists by external ids', async () => {
      const findArtistsByExternalIds = vi
        .spyOn(artistsRepository, 'findArtistsByExternalIds')
        .mockResolvedValue(artistEntitiesMock)
      const getArtistsSpy = vi.spyOn(spotifyArtistsService, 'getArtists')
      const createArtistSpy = vi.spyOn(artistsRepository, 'createArtist')

      expect(
        await artistsRepository.findOrCreateArtistsFromExternalIds(ids)
      ).toEqual(artistEntitiesMock)
      expect(findArtistsByExternalIds).toHaveBeenCalledWith(ids)
      expect(createArtistSpy).not.toHaveBeenCalled()
      expect(getArtistsSpy).not.toHaveBeenCalled()
    })

    test('should create artists by external ids', async () => {
      const findArtistsByExternalIds = vi
        .spyOn(artistsRepository, 'findArtistsByExternalIds')
        .mockResolvedValue([])
      const getArtistsSpy = vi
        .spyOn(spotifyArtistsService, 'getArtists')
        .mockResolvedValue(sdkArtistsMock)
      const createArtistSpy = vi
        .spyOn(artistsRepository, 'createArtist')
        .mockResolvedValue(artistEntityMock)

      expect(
        await artistsRepository.findOrCreateArtistsFromExternalIds(ids)
      ).toEqual(artistEntitiesMock)
      expect(findArtistsByExternalIds).toHaveBeenCalledWith(ids)
      expect(getArtistsSpy).toHaveBeenCalledWith(ids, false)
      expect(createArtistSpy).toHaveBeenCalledWith(sdkArtistMock)
    })
  })
})
