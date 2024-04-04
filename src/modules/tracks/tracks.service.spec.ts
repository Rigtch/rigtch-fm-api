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
} from '@common/mocks'
import { removeDuplicates } from '@common/utils'
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
            findOrCreateAlbumFromExternalId: vi.fn(),
            findOrCreateAlbumsFromExternalIds: vi.fn(),
          },
        },
        {
          provide: ArtistsService,
          useValue: {
            findOrCreateArtistsFromExternalIds: vi.fn(),
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

  test('should create track from external id', async () => {
    const getTrackSpy = (
      vi.spyOn(
        spotifyTracksService,
        'getTrack'
      ) as unknown as GetTrackMockInstance
    ).mockResolvedValue(sdkTrackMock)
    const createTrackSpy = vi
      .spyOn(tracksRepository, 'createTrack')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksService.createTrackFromExternalId(
        sdkTrackMock.id,
        albumEntityMock
      )
    ).toEqual(trackEntityMock)
    expect(getTrackSpy).toHaveBeenCalledWith(sdkTrackMock.id, false)
    expect(createTrackSpy).toHaveBeenCalledWith(sdkTrackMock, albumEntityMock)
  })

  test('should create tracks from external ids', async () => {
    const getTracksSpy = (
      vi.spyOn(
        spotifyTracksService,
        'getTracks'
      ) as unknown as GetTracksMockInstance
    ).mockResolvedValue(sdkTracksMock)
    const createTrackSpy = vi
      .spyOn(tracksRepository, 'createTrack')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksService.createTracksFromExternalIds(
        sdkTracksMock.map(track => track.id),
        albumEntityMock
      )
    ).toEqual(trackEntitiesMock)
    expect(getTracksSpy).toHaveBeenCalledWith(
      sdkTracksMock.map(track => track.id),
      false
    )
    expect(createTrackSpy).toHaveBeenCalledWith(sdkTrackMock, albumEntityMock)
  })

  describe('findOrCreateTrackFromExternalId', () => {
    test('should find track by external id', async () => {
      const findTrackByExternalIdSpy = vi
        .spyOn(tracksRepository, 'findTrackByExternalId')
        .mockResolvedValue(trackEntityMock)
      const findOrCreateAlbumFromExternalIdSpy = vi.spyOn(
        albumsService,
        'findOrCreateAlbumFromExternalId'
      )

      expect(
        await tracksService.findOrCreateTrackFromExternalId(
          sdkTrackMock.id,
          albumEntityMock.externalId
        )
      ).toEqual(trackEntityMock)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(sdkTrackMock.id)
      expect(findOrCreateAlbumFromExternalIdSpy).not.toHaveBeenCalled()
    })

    test('should create whole album and then find track by external id', async () => {
      const findTrackByExternalIdSpy = vi
        .spyOn(tracksRepository, 'findTrackByExternalId')
        .mockResolvedValueOnce(null)
        .mockResolvedValue(trackEntityMock)

      const findOrCreateAlbumFromExternalIdSpy = vi.spyOn(
        albumsService,
        'findOrCreateAlbumFromExternalId'
      )

      expect(
        await tracksService.findOrCreateTrackFromExternalId(
          sdkTrackMock.id,
          albumEntityMock.externalId
        )
      ).toEqual(trackEntityMock)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(sdkTrackMock.id)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledTimes(2)
      expect(findOrCreateAlbumFromExternalIdSpy).toHaveBeenCalledWith(
        albumEntityMock.externalId
      )
    })
  })

  describe('findOrCreateTracks', () => {
    test('should find tracks', async () => {
      const findTracksByExternalIdsSpy = vi
        .spyOn(tracksRepository, 'findTracksByExternalIds')
        .mockResolvedValue(trackEntitiesMock)

      expect(await tracksService.findOrCreateTracks(sdkTracksMock)).toEqual(
        trackEntitiesMock
      )
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith(
        sdkTracksMock.map(track => track.id)
      )
    })

    test('should create tracks from external ids', async () => {
      const findTracksByExternalIdsSpy = vi
        .spyOn(tracksRepository, 'findTracksByExternalIds')
        .mockResolvedValueOnce([])
        .mockResolvedValue(trackEntitiesMock)
      const findOrCreateArtistsFromExternalIdsSpy = vi
        .spyOn(artistsService, 'findOrCreateArtistsFromExternalIds')
        .mockResolvedValue(artistEntitiesMock)
      const findOrCreateAlbumsFromExternalIdsSpy = vi.spyOn(
        albumsService,
        'findOrCreateAlbumsFromExternalIds'
      )

      expect(await tracksService.findOrCreateTracks(sdkTracksMock)).toEqual(
        trackEntitiesMock
      )
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith(
        sdkTracksMock.map(track => track.id)
      )
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledTimes(2)
      expect(findOrCreateArtistsFromExternalIdsSpy).toHaveBeenCalledWith(
        removeDuplicates(
          sdkTracksMock.flatMap(track => track.artists).map(artist => artist.id)
        )
      )
      expect(findOrCreateAlbumsFromExternalIdsSpy).toHaveBeenCalledWith(
        removeDuplicates(sdkTracksMock.map(track => track.album.id)),
        artistEntitiesMock
      )
    })
  })
})
