import { Test, TestingModule } from '@nestjs/testing'
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

describe('TracksService', () => {
  let moduleRef: TestingModule
  let tracksService: TracksService
  let tracksRepository: TracksRepository
  let spotifyTracksService: SpotifyTracksService
  let albumsService: AlbumsService
  let artistsService: ArtistsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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

    tracksService = moduleRef.get(TracksService)
    tracksRepository = moduleRef.get(TracksRepository)
    spotifyTracksService = moduleRef.get(SpotifyTracksService)
    albumsService = moduleRef.get(AlbumsService)
    artistsService = moduleRef.get(ArtistsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tracksService).toBeDefined()
  })

  describe('create', () => {
    let createTrackFromDtoSpy: MockInstance
    let createTracksFromExternalIdsSpy: MockInstance

    beforeEach(() => {
      createTrackFromDtoSpy = vi.spyOn(tracksService, 'createTrackFromDto')
      createTracksFromExternalIdsSpy = vi.spyOn(
        tracksService,
        'createTracksFromExternalIds'
      )
    })

    test('should create track from dto', async () => {
      createTrackFromDtoSpy.mockResolvedValue(trackEntityMock)

      expect(await tracksService.create(sdkTrackMock, albumEntityMock)).toEqual(
        trackEntityMock
      )
      expect(createTrackFromDtoSpy).toHaveBeenCalledWith(
        sdkTrackMock,
        albumEntityMock
      )

      expect(createTrackFromDtoSpy).toHaveBeenCalledWith(
        sdkTrackMock,
        albumEntityMock
      )
      expect(createTracksFromExternalIdsSpy).not.toHaveBeenCalled()
    })

    test('should create tracks from external ids', async () => {
      createTracksFromExternalIdsSpy.mockResolvedValue(trackEntitiesMock)

      expect(
        await tracksService.create([sdkTrackMock.id], [albumEntityMock])
      ).toEqual(trackEntitiesMock)

      expect(createTrackFromDtoSpy).not.toHaveBeenCalled()
      expect(createTracksFromExternalIdsSpy).toHaveBeenCalledWith(
        [sdkTrackMock.id],
        [albumEntityMock]
      )
    })
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
    let findOrCreateTracksFromDtosSpy: MockInstance
    let findOrCreateTracksFromExternalIdsSpy: MockInstance

    beforeEach(() => {
      findOrCreateTracksFromDtosSpy = vi.spyOn(
        tracksService,
        'findOrCreateTracksFromDtos'
      )
      findOrCreateTracksFromExternalIdsSpy = vi.spyOn(
        tracksService,
        'findOrCreateTracksFromExternalIds'
      )
    })

    test('should return empty array if no tracks', async () => {
      expect(await tracksService.findOrCreate([])).toEqual([])

      expect(findOrCreateTracksFromDtosSpy).not.toHaveBeenCalled()
      expect(findOrCreateTracksFromExternalIdsSpy).not.toHaveBeenCalled()
    })

    test('should find or create tracks from externalIds', async () => {
      const externalIds = sdkTracksMock.map(({ id }) => id)

      findOrCreateTracksFromExternalIdsSpy.mockResolvedValue(trackEntitiesMock)

      expect(await tracksService.findOrCreate(externalIds)).toEqual(
        trackEntitiesMock
      )

      expect(findOrCreateTracksFromExternalIdsSpy).toHaveBeenCalledWith(
        externalIds
      )
      expect(findOrCreateTracksFromDtosSpy).not.toHaveBeenCalled()
    })

    test('should find or create tracks from dtos', async () => {
      findOrCreateTracksFromDtosSpy.mockResolvedValue(trackEntitiesMock)

      expect(await tracksService.findOrCreate(sdkTracksMock)).toEqual(
        trackEntitiesMock
      )

      expect(findOrCreateTracksFromDtosSpy).toHaveBeenCalledWith(sdkTracksMock)
      expect(findOrCreateTracksFromExternalIdsSpy).not.toHaveBeenCalled()
    })
  })

  describe('findOrCreateTracksFromExternalIds', () => {
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
      expect(await tracksService.findOrCreate([])).toEqual([])
      expect(findTrackByExternalIdSpy).not.toHaveBeenCalled()
      expect(findOrCreateAlbum).not.toHaveBeenCalled()
    })

    test('should find tracks by external ids', async () => {
      findTrackByExternalIdSpy.mockResolvedValue(foundTracks)

      expect(await tracksService.findOrCreate(sdkTracks)).toEqual(foundTracks)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(
        sdkTracks.map(track => track.id)
      )
      expect(findOrCreateAlbum).not.toHaveBeenCalled()
    })

    test('should create tracks from external ids', async () => {
      findTrackByExternalIdSpy
        .mockResolvedValueOnce([])
        .mockResolvedValue(foundTracks)

      expect(await tracksService.findOrCreate(sdkTracks)).toEqual(foundTracks)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(
        sdkTracks.map(track => track.id)
      )
      expect(findTrackByExternalIdSpy).toHaveBeenCalledTimes(2)
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
      expect(await tracksService.findOrCreate([])).toEqual([])
      expect(findTrackByExternalIdSpy).not.toHaveBeenCalled()
      expect(findOrCreateAlbum).not.toHaveBeenCalled()
    })

    test('should find tracks by external ids', async () => {
      findTrackByExternalIdSpy.mockResolvedValue(foundTracks)

      expect(await tracksService.findOrCreate(sdkTracks)).toEqual(foundTracks)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(
        sdkTracks.map(track => track.id)
      )
      expect(findOrCreateAlbum).not.toHaveBeenCalled()
    })

    test('should create tracks from external ids', async () => {
      findTrackByExternalIdSpy
        .mockResolvedValueOnce([])
        .mockResolvedValue(foundTracks)

      expect(await tracksService.findOrCreate(sdkTracks)).toEqual(foundTracks)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(
        sdkTracks.map(track => track.id)
      )
      expect(findTrackByExternalIdSpy).toHaveBeenCalledTimes(2)
    })
  })
})
