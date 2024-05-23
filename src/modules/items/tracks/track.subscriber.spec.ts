import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { MockInstance } from 'vitest'

import { AlbumsService } from '../albums'

import { TrackSubscriber } from './track.subscriber'
import { Track } from './track.entity'

import { SpotifyTracksService } from '@modules/spotify/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import {
  albumEntityMock,
  sdkAlbumMock,
  sdkTrackMock,
  trackEntityMock,
} from '@common/mocks'

describe('TrackSubscriber', () => {
  let moduleRef: TestingModule
  let trackSubscriber: TrackSubscriber
  let spotifyTracksService: SpotifyTracksService
  let spotifyAlbumsService: SpotifyAlbumsService
  let albumsService: AlbumsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        TrackSubscriber,
        {
          provide: DataSource,
          useValue: {
            subscribers: [],
          },
        },
        {
          provide: SpotifyTracksService,
          useValue: {
            getTrack: vi.fn(),
          },
        },
        {
          provide: SpotifyAlbumsService,
          useValue: {
            getAlbum: vi.fn(),
          },
        },
        {
          provide: AlbumsService,
          useValue: {
            updateOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    trackSubscriber = moduleRef.get(TrackSubscriber)
    spotifyTracksService = moduleRef.get(SpotifyTracksService)
    spotifyAlbumsService = moduleRef.get(SpotifyAlbumsService)
    albumsService = moduleRef.get(AlbumsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(trackSubscriber).toBeDefined()
  })

  test('should listen to track entity', () => {
    expect(trackSubscriber.listenTo()).toEqual(Track)
  })

  describe('afterLoad', () => {
    let getTrackSpy: MockInstance
    let getAlbumSpy: MockInstance
    let updateOrCreateSpy: MockInstance

    beforeEach(() => {
      getTrackSpy = vi.spyOn(spotifyTracksService, 'getTrack')
      getAlbumSpy = vi.spyOn(spotifyAlbumsService, 'getAlbum')
      updateOrCreateSpy = vi.spyOn(albumsService, 'updateOrCreate')
    })

    test('should update album if not found', async () => {
      getTrackSpy.mockResolvedValue(sdkTrackMock)
      getAlbumSpy.mockResolvedValue(sdkAlbumMock)
      updateOrCreateSpy.mockResolvedValue(albumEntityMock)

      await trackSubscriber.afterLoad({
        ...trackEntityMock,
        album: undefined,
      })

      expect(getTrackSpy).toHaveBeenCalledWith(
        trackEntityMock.externalId,
        false
      )
      expect(getAlbumSpy).toHaveBeenCalledWith(sdkTrackMock.album.id, false)
      expect(updateOrCreateSpy).toHaveBeenCalledWith(sdkAlbumMock)
      expect(trackEntityMock.album).toEqual(albumEntityMock)
    })

    test('should not update album if already found', async () => {
      trackEntityMock.album = albumEntityMock

      await trackSubscriber.afterLoad(trackEntityMock)

      expect(getTrackSpy).not.toHaveBeenCalled()
      expect(getAlbumSpy).not.toHaveBeenCalled()
      expect(updateOrCreateSpy).not.toHaveBeenCalled()
      expect(trackEntityMock.album).toEqual(albumEntityMock)
    })
  })
})
