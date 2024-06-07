import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { MockInstance } from 'vitest'
import { Context, PlayHistory, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { mock } from 'vitest-mock-extended'

import { SpotifyPlayerService } from './spotify-player.service'

import { AdaptersModule } from '@common/adapters'
import {
  accessTokenMock,
  playbackStateMock,
  recentlyPlayedTracksPageMockFactory,
  sdkPlaybackStateMock,
  sdkTracksMock,
  trackMock,
  tracksMock,
} from '@common/mocks'

vi.mock('@spotify/web-api-ts-sdk', () => {
  const spotifyApiConstructor = vi.fn().mockReturnValue({
    player: {
      getRecentlyPlayedTracks: vi.fn(),
      getAvailableDevices: vi.fn(),
      getPlaybackState: vi.fn(),
      pausePlayback: vi.fn(),
      startResumePlayback: vi.fn(),
    },
  })

  return {
    SpotifyApi: Object.assign(spotifyApiConstructor, {
      withAccessToken: vi.fn().mockReturnThis(),
    }),
  }
})

describe('SpotifyPlayerService', () => {
  const deviceId = 'deviceId'

  let moduleRef: TestingModule
  let spotifyPlayerService: SpotifyPlayerService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AdaptersModule],
      providers: [
        SpotifyPlayerService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('clientId'),
          },
        },
      ],
    }).compile()

    spotifyPlayerService = moduleRef.get(SpotifyPlayerService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(spotifyPlayerService).toBeDefined()
  })

  describe('getRecentlyPlayedTracks', () => {
    let withAccessTokenSpy: MockInstance
    let getRecentlyPlayedTracksMock: MockInstance

    const playedAt = new Date().toDateString()
    const playHistory: PlayHistory[] = sdkTracksMock.map(track => ({
      track,
      played_at: playedAt,
      context: mock<Context>(),
    }))

    beforeEach(() => {
      getRecentlyPlayedTracksMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          player: {
            getRecentlyPlayedTracks: getRecentlyPlayedTracksMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return a recently played tracks page', async () => {
      getRecentlyPlayedTracksMock.mockResolvedValue(
        recentlyPlayedTracksPageMockFactory(playHistory)
      )

      const recentlyPlayedTracksPage =
        await spotifyPlayerService.getRecentlyPlayedTracks(
          accessTokenMock,
          20,
          {},
          false
        )

      expect(recentlyPlayedTracksPage).toEqual(
        recentlyPlayedTracksPageMockFactory(playHistory)
      )

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getRecentlyPlayedTracksMock).toHaveBeenCalledWith(20, undefined)
    })

    test('should return a recently played tracks page with before', async () => {
      const timestamp = Date.now()

      getRecentlyPlayedTracksMock.mockResolvedValue(
        recentlyPlayedTracksPageMockFactory(playHistory)
      )

      const recentlyPlayedTracksPage =
        await spotifyPlayerService.getRecentlyPlayedTracks(
          accessTokenMock,
          20,
          { before: timestamp },
          false
        )

      expect(recentlyPlayedTracksPage).toEqual(
        recentlyPlayedTracksPageMockFactory(playHistory)
      )

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getRecentlyPlayedTracksMock).toHaveBeenCalledWith(20, {
        timestamp,
        type: 'before',
      })
    })

    test('should return a recently played tracks page with after', async () => {
      const timestamp = Date.now()

      getRecentlyPlayedTracksMock.mockResolvedValue(
        recentlyPlayedTracksPageMockFactory(playHistory)
      )

      const recentlyPlayedTracksPage =
        await spotifyPlayerService.getRecentlyPlayedTracks(
          accessTokenMock,
          20,
          { after: timestamp },
          false
        )

      expect(recentlyPlayedTracksPage).toEqual(
        recentlyPlayedTracksPageMockFactory(playHistory)
      )

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getRecentlyPlayedTracksMock).toHaveBeenCalledWith(20, {
        timestamp,
        type: 'after',
      })
    })

    test('should return adapted recently played tracks page', async () => {
      getRecentlyPlayedTracksMock.mockResolvedValue(
        recentlyPlayedTracksPageMockFactory(playHistory)
      )

      const recentlyPlayedTracksPage =
        await spotifyPlayerService.getRecentlyPlayedTracks(
          accessTokenMock,
          20,
          {},
          true
        )

      expect(recentlyPlayedTracksPage.items).toEqual(
        tracksMock.map(() => ({
          ...trackMock,
          playedAt,
        }))
      )

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getRecentlyPlayedTracksMock).toHaveBeenCalledWith(20, undefined)
    })
  })

  describe('getPlaybackState', () => {
    let withAccessTokenSpy: MockInstance
    let getPlaybackStateMock: MockInstance

    beforeEach(() => {
      getPlaybackStateMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          player: {
            getPlaybackState: getPlaybackStateMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return playback state', async () => {
      getPlaybackStateMock.mockResolvedValue(sdkPlaybackStateMock)

      const playbackState =
        await spotifyPlayerService.getPlaybackState(accessTokenMock)

      expect(playbackState).toEqual(playbackStateMock)

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getPlaybackStateMock).toHaveBeenCalledWith()
    })
  })

  describe('pausePlayback', () => {
    let withAccessTokenSpy: MockInstance
    let getAvailableDevicesMock: MockInstance
    let pausePlaybackMock: MockInstance

    beforeEach(() => {
      getAvailableDevicesMock = vi.fn()
      pausePlaybackMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          player: {
            getAvailableDevices: getAvailableDevicesMock,
            pausePlayback: pausePlaybackMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return a playback state', async () => {
      getAvailableDevicesMock.mockResolvedValue({
        devices: [{ id: deviceId, is_active: true }],
      })

      const pausePlayerResponse =
        await spotifyPlayerService.pausePlayback(accessTokenMock)

      expect(pausePlayerResponse).toEqual(true)

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getAvailableDevicesMock).toHaveBeenCalledWith()
      expect(pausePlaybackMock).toHaveBeenCalledWith(deviceId)
    })

    test('should return false if no device is active', async () => {
      getAvailableDevicesMock.mockResolvedValue({
        devices: [{ id: deviceId, is_active: false }],
      })

      const pausePlayerResponse =
        await spotifyPlayerService.pausePlayback(accessTokenMock)

      expect(pausePlayerResponse).toEqual(false)

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getAvailableDevicesMock).toHaveBeenCalledWith()
      expect(pausePlaybackMock).not.toHaveBeenCalled()
    })
  })

  describe('startResumePlayback', () => {
    let withAccessTokenSpy: MockInstance
    let getAvailableDevicesMock: MockInstance
    let startResumePlaybackMock: MockInstance

    beforeEach(() => {
      getAvailableDevicesMock = vi.fn()
      startResumePlaybackMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          player: {
            getAvailableDevices: getAvailableDevicesMock,
            startResumePlayback: startResumePlaybackMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return a playback state', async () => {
      getAvailableDevicesMock.mockResolvedValue({
        devices: [{ id: deviceId, is_active: true }],
      })

      const resumePlayerResponse =
        await spotifyPlayerService.resumePlayback(accessTokenMock)

      expect(resumePlayerResponse).toEqual(true)

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getAvailableDevicesMock).toHaveBeenCalledWith()
      expect(startResumePlaybackMock).toHaveBeenCalledWith(deviceId)
    })

    test('should return false if no device is active', async () => {
      getAvailableDevicesMock.mockResolvedValue({
        devices: [{ id: deviceId, is_active: false }],
      })

      const resumePlayerResponse =
        await spotifyPlayerService.resumePlayback(accessTokenMock)

      expect(resumePlayerResponse).toEqual(false)

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getAvailableDevicesMock).toHaveBeenCalledWith()
      expect(startResumePlaybackMock).not.toHaveBeenCalled()
    })
  })
})
