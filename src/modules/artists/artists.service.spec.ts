import { Test } from '@nestjs/testing'

import { ArtistsRepository } from './artists.repository'
import { ArtistsService } from './artists.service'

import { SpotifyArtistsService } from '@modules/spotify/artists'
import {
  artistEntityMock,
  sdkArtistMock,
  sdkArtistsMock,
  artistEntitiesMock,
} from '@common/mocks'

describe('ArtistsService', () => {
  let artistsService: ArtistsService
  let artistsRepository: ArtistsRepository
  let spotifyArtistsService: SpotifyArtistsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ArtistsService,
        {
          provide: ArtistsRepository,
          useValue: {
            findArtistByExternalId: vi.fn(),
            createArtist: vi.fn(),
            findArtistsByExternalIds: vi.fn(),
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

    artistsService = module.get(ArtistsService)
    artistsRepository = module.get(ArtistsRepository)
    spotifyArtistsService = module.get(SpotifyArtistsService)
  })

  test('should be defined', () => {
    expect(artistsService).toBeDefined()
  })

  describe('findOrCreateArtist', () => {
    test('should find artist', async () => {
      const findArtistByExternalId = vi
        .spyOn(artistsRepository, 'findArtistByExternalId')
        .mockResolvedValue(artistEntityMock)
      const createArtistSpy = vi.spyOn(artistsRepository, 'createArtist')

      expect(await artistsService.findOrCreateArtist(sdkArtistMock)).toEqual(
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

      expect(await artistsService.findOrCreateArtist(sdkArtistMock)).toEqual(
        artistEntityMock
      )
      expect(findArtistByExternalId).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(createArtistSpy).toHaveBeenCalledWith(sdkArtistMock)
    })
  })

  test('should find or create artists', async () => {
    const findOrCreateArtistSpy = vi
      .spyOn(artistsService, 'findOrCreateArtist')
      .mockResolvedValue(artistEntityMock)

    expect(await artistsService.findOrCreateArtists(sdkArtistsMock)).toEqual(
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
        await artistsService.findOrCreateArtistFromExternalId(sdkArtistMock.id)
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
        await artistsService.findOrCreateArtistFromExternalId(sdkArtistMock.id)
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
        await artistsService.findOrCreateArtistsFromExternalIds(ids)
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
        await artistsService.findOrCreateArtistsFromExternalIds(ids)
      ).toEqual(artistEntitiesMock)
      expect(findArtistsByExternalIds).toHaveBeenCalledWith(ids)
      expect(getArtistsSpy).toHaveBeenCalledWith(ids, false)
      expect(createArtistSpy).toHaveBeenCalledWith(sdkArtistMock)
    })
  })
})
