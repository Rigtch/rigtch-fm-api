import { TestingModule, Test } from '@nestjs/testing'

import {
  formattedTracksMock,
  spotifyArtistsMock,
  spotifyTracksMock,
  formattedArtistsMock,
  spotifyProfileMock,
  formattedProfileMock,
  spotifyDevicesMock,
  spotifyPlaybackStateMock,
  formattedPlaybackStateMock,
  formattedDevicesMock,
  topGenresMock,
} from './mocks'
import { SpotifyService } from './spotify.service'

describe('AuthService', () => {
  let spotifyService: SpotifyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyService],
    }).compile()

    spotifyService = module.get<SpotifyService>(SpotifyService)
  })

  it('should be defined', () => {
    expect(spotifyService).toBeDefined()
  })

  it('should format artists', () => {
    expect(spotifyService.formatArtists(spotifyArtistsMock)).toEqual(
      formattedArtistsMock
    )
  })

  it('should format genres', () => {
    expect(spotifyService.formatGenres(spotifyArtistsMock, 3)).toEqual(
      topGenresMock
    )
  })

  describe('formatTracks', () => {
    it('should format tracks', () => {
      expect(spotifyService.formatTracks(spotifyTracksMock)).toEqual(
        formattedTracksMock
      )
    })

    it('should format tracks without duration', () => {
      expect(
        spotifyService.formatTracks(
          spotifyTracksMock.map(({ progress_ms, ...rest }) => rest)
        )
      ).toEqual(formattedTracksMock.map(({ progress, ...rest }) => rest))
    })

    it('should format tracks without playedAt field', () => {
      expect(
        spotifyService.formatTracks(
          spotifyTracksMock.map(({ played_at, ...rest }) => rest)
        )
      ).toEqual(formattedTracksMock.map(({ playedAt, ...rest }) => rest))
    })
  })

  it('should format profile', () => {
    expect(spotifyService.formatProfile(spotifyProfileMock)).toEqual(
      formattedProfileMock
    )
  })

  it('should format devices', () => {
    expect(spotifyService.formatDevices(spotifyDevicesMock)).toEqual(
      formattedDevicesMock
    )
  })

  it('should format playback state', () => {
    expect(
      spotifyService.formatPlaybackState(spotifyPlaybackStateMock)
    ).toEqual(formattedPlaybackStateMock)
  })
})
