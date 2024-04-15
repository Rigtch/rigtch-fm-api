import { Test } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { TracksRepository } from './tracks.repository'
import { TracksService } from './tracks.service'

import { SpotifyTracksService } from '@modules/spotify/tracks'
import { AlbumsService } from '@modules/albums'
import { ArtistsService } from '@modules/artists'
import {
  sdkTrackMock,
  trackEntityMock,
  albumEntityMock,
  sdkTracksMock,
  trackEntitiesMock,
  artistEntitiesMock,
  albumsEntitiesMock,
} from '@common/mocks'
import { SdkTrack } from '@common/types/spotify'

type GetTracksMockInstance = MockInstance<
  [ids: string, adapt: false],
  Promise<SdkTrack[]>
>
type GetTrackMockInstance = MockInstance<
  [id: string, adapt: false],
  Promise<SdkTrack>
>

describe('TracksService', () => {
  let tracksService: TracksService
  let tracksRepository: TracksRepository
  let spotifyTracksService: SpotifyTracksService
  let albumsService: AlbumsService
  let artistsService: ArtistsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TracksService,
        {
          provide: TracksRepository,
          useValue: {
            findTrackByExternalId: vi.fn(),
            createTrack: vi.fn(),
            findTracksByExternalIds: vi.fn(),
          },
        },
        {
          provide: SpotifyTracksService,
          useValue: {
            getTrack: vi.fn(),
            getTracks: vi.fn(),
          },
        },
        {
          provide: AlbumsService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
        {
          provide: ArtistsService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    tracksService = module.get(TracksService)
    tracksRepository = module.get(TracksRepository)
    spotifyTracksService = module.get(SpotifyTracksService)
    albumsService = module.get(AlbumsService)
    artistsService = module.get(ArtistsService)
  })

  test('should be defined', () => {
    expect(tracksService).toBeDefined()
  })

  describe('createTrackFromDto', () => {
    let findOrCreateArtistsSpy: MockInstance
    let createTrackSpy: MockInstance

    beforeEach(() => {
      findOrCreateArtistsSpy = vi.spyOn(artistsService, 'findOrCreate')
      createTrackSpy = vi.spyOn(tracksRepository, 'createTrack')
    })

    test('should create track from dto without artists', async () => {
      createTrackSpy.mockResolvedValue(trackEntityMock)
      findOrCreateArtistsSpy.mockResolvedValue(artistEntitiesMock)

      expect(
        await tracksService.createTrackFromDto(sdkTrackMock, albumEntityMock)
      ).toEqual(trackEntityMock)
      expect(findOrCreateArtistsSpy).toHaveBeenCalledWith(
        trackEntityMock.artists.map(artist => artist.id)
      )
      expect(createTrackSpy).toHaveBeenCalled()
    })

    test('should create track from dto with artists', async () => {
      createTrackSpy.mockResolvedValue(trackEntityMock)

      expect(
        await tracksService.createTrackFromDto(
          sdkTrackMock,
          albumEntityMock,
          artistEntitiesMock
        )
      ).toEqual(trackEntityMock)
      expect(findOrCreateArtistsSpy).not.toHaveBeenCalled()
      expect(createTrackSpy).toHaveBeenCalled()
    })
  })

  test('should create tracks from dtos', async () => {
    const createTrackFromDtoSpy = vi
      .spyOn(tracksService, 'createTrackFromDto')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksService.createTracksFromDtos(
        sdkTracksMock,
        albumsEntitiesMock,
        artistEntitiesMock
      )
    ).toEqual(trackEntitiesMock)
    expect(createTrackFromDtoSpy).toHaveBeenCalledTimes(sdkTracksMock.length)
  })

  test('should create track from external id', async () => {
    const getTrackSpy = (
      vi.spyOn(
        spotifyTracksService,
        'getTrack'
      ) as unknown as GetTrackMockInstance
    ).mockResolvedValue(sdkTrackMock)
    const createTrackFromDtoSpy = vi
      .spyOn(tracksService, 'createTrackFromDto')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksService.createTrackFromExternalId(
        sdkTrackMock.id,
        albumEntityMock
      )
    ).toEqual(trackEntityMock)
    expect(getTrackSpy).toHaveBeenCalledWith(sdkTrackMock.id, false)
    expect(createTrackFromDtoSpy).toHaveBeenCalledWith(
      sdkTrackMock,
      albumEntityMock
    )
  })

  test('should create tracks from external ids', async () => {
    const getTracksSpy = (
      vi.spyOn(
        spotifyTracksService,
        'getTracks'
      ) as unknown as GetTracksMockInstance
    ).mockResolvedValue(sdkTracksMock)
    const createTrackFromDtoSpy = vi
      .spyOn(tracksService, 'createTrackFromDto')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksService.createTracksFromExternalIds(
        sdkTracksMock.map(track => track.id),
        albumsEntitiesMock
      )
    ).toEqual(trackEntitiesMock)
    expect(getTracksSpy).toHaveBeenCalledWith(
      sdkTracksMock.map(track => track.id),
      false
    )
    expect(createTrackFromDtoSpy).toHaveBeenCalledWith(
      sdkTrackMock,
      albumEntityMock
    )
  })

  describe('findOrCreate', () => {
    let findOrCreateTrackFromDtoSpy: MockInstance
    let findOrCreateTracksFromDtosSpy: MockInstance

    beforeEach(() => {
      findOrCreateTrackFromDtoSpy = vi.spyOn(
        tracksService,
        'findOrCreateTrackFromDto'
      )
      findOrCreateTracksFromDtosSpy = vi.spyOn(
        tracksService,
        'findOrCreateTracksFromDtos'
      )
    })

    test('should find or create track from dto', async () => {
      findOrCreateTrackFromDtoSpy.mockResolvedValue(trackEntityMock)

      expect(await tracksService.findOrCreate(sdkTrackMock)).toEqual(
        trackEntityMock
      )

      expect(findOrCreateTrackFromDtoSpy).toHaveBeenCalledWith(sdkTrackMock)
      expect(findOrCreateTracksFromDtosSpy).not.toHaveBeenCalled()
    })

    test('should return empty array if no data', async () => {
      expect(await tracksService.findOrCreate([])).toEqual([])

      expect(findOrCreateTrackFromDtoSpy).not.toHaveBeenCalled()
      expect(findOrCreateTracksFromDtosSpy).not.toHaveBeenCalled()
    })

    test('should find or create tracks from dtos', async () => {
      findOrCreateTracksFromDtosSpy.mockResolvedValue(trackEntitiesMock)

      expect(await tracksService.findOrCreate(sdkTracksMock)).toEqual(
        trackEntitiesMock
      )

      expect(findOrCreateTracksFromDtosSpy).toHaveBeenCalledWith(sdkTracksMock)
      expect(findOrCreateTrackFromDtoSpy).not.toHaveBeenCalled()
    })
  })

  describe('findOrCreateTrackFromDto', () => {
    let findTrackByExternalIdSpy: MockInstance
    let findOrCreateAlbumSpy: MockInstance

    beforeEach(() => {
      findTrackByExternalIdSpy = vi.spyOn(
        tracksRepository,
        'findTrackByExternalId'
      )
      findOrCreateAlbumSpy = vi.spyOn(albumsService, 'findOrCreate')
    })

    test('should find track by external id', async () => {
      findTrackByExternalIdSpy.mockResolvedValue(trackEntityMock)

      expect(
        await tracksService.findOrCreateTrackFromDto(sdkTrackMock)
      ).toEqual(trackEntityMock)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(sdkTrackMock.id)
      expect(findOrCreateAlbumSpy).not.toHaveBeenCalled()
    })

    test('should create whole album and then find track by external id', async () => {
      findTrackByExternalIdSpy
        .mockResolvedValueOnce(null)
        .mockResolvedValue(trackEntityMock)

      expect(
        await tracksService.findOrCreateTrackFromDto(sdkTrackMock)
      ).toEqual(trackEntityMock)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(sdkTrackMock.id)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledTimes(2)
      expect(findOrCreateAlbumSpy).toHaveBeenCalledWith(sdkTrackMock.album.id)
    })
  })

  describe('findOrCreateTracksFromDtos', () => {
    const sdkTracks = [sdkTrackMock, sdkTrackMock]
    const foundTracks = [trackEntityMock, trackEntityMock]

    let findTrackByExternalIdSpy: MockInstance
    let findOrCreateAlbum: MockInstance

    beforeEach(() => {
      findTrackByExternalIdSpy = vi.spyOn(
        tracksRepository,
        'findTracksByExternalIds'
      )
      findOrCreateAlbum = vi.spyOn(albumsService, 'findOrCreate')
    })

    test('should return empty array if no tracks', async () => {
      expect(await tracksService.findOrCreateTracksFromDtos([])).toEqual([])
      expect(findTrackByExternalIdSpy).not.toHaveBeenCalled()
      expect(findOrCreateAlbum).not.toHaveBeenCalled()
    })

    test('should find tracks by external ids', async () => {
      findTrackByExternalIdSpy.mockResolvedValue(foundTracks)

      expect(await tracksService.findOrCreateTracksFromDtos(sdkTracks)).toEqual(
        foundTracks
      )
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(
        sdkTracks.map(track => track.id)
      )
      expect(findOrCreateAlbum).not.toHaveBeenCalled()
    })

    test('should create tracks from external ids', async () => {
      findTrackByExternalIdSpy
        .mockResolvedValueOnce([])
        .mockResolvedValue(foundTracks)

      expect(await tracksService.findOrCreateTracksFromDtos(sdkTracks)).toEqual(
        foundTracks
      )
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(
        sdkTracks.map(track => track.id)
      )
      expect(findTrackByExternalIdSpy).toHaveBeenCalledTimes(2)
    })
  })
})
