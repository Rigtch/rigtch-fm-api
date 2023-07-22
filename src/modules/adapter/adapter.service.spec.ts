import { TestingModule, Test } from '@nestjs/testing'

import { AdapterService } from './adapter.service'

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
  spotifyArtistMock,
  formattedArtistMock,
  spotifyTrackMock,
  formattedTrackMock,
  formattedAudioFeaturesMock,
  spotifyAudioFeaturesMock,
} from '@common/mocks'

describe('AdapterService', () => {
  let adapterService: AdapterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdapterService],
    }).compile()

    adapterService = module.get<AdapterService>(AdapterService)
  })

  it('should be defined', () => {
    expect(adapterService).toBeDefined()
  })

  it('should adapt artist', () => {
    expect(adapterService.adaptArtist(spotifyArtistMock)).toEqual(
      formattedArtistMock
    )
  })

  it('should adapt artists', () => {
    expect(adapterService.adaptArtists(spotifyArtistsMock)).toEqual(
      formattedArtistsMock
    )
  })

  it('should adapt genres', () => {
    expect(adapterService.adaptGenres(spotifyArtistsMock, 3)).toEqual(
      topGenresMock
    )
  })

  describe('adaptTrack', () => {
    it('should adapt tracks', () => {
      expect(adapterService.adaptTrack(spotifyTrackMock)).toEqual(
        formattedTrackMock
      )
    })

    it('should adapt tracks without duration', () => {
      const { progress_ms, ...spotifyTrackMockRest } = spotifyTrackMock
      const { progress, ...formattedTrackMockRest } = formattedTrackMock

      expect(
        adapterService.adaptTrack({
          ...spotifyTrackMockRest,
        })
      ).toEqual(formattedTrackMockRest)
    })

    it('should adapt tracks without playedAt field', () => {
      const { played_at, ...spotifyTrackMockRest } = spotifyTrackMock
      const { playedAt, ...formattedTrackMockRest } = formattedTrackMock

      expect(adapterService.adaptTrack(spotifyTrackMockRest)).toEqual(
        formattedTrackMockRest
      )
    })
  })

  describe('adaptTracks', () => {
    it('should adapt tracks', () => {
      expect(adapterService.adaptTracks(spotifyTracksMock)).toEqual(
        formattedTracksMock
      )
    })

    it('should adapt tracks without duration', () => {
      expect(
        adapterService.adaptTracks(
          spotifyTracksMock.map(({ progress_ms, ...rest }) => rest)
        )
      ).toEqual(formattedTracksMock.map(({ progress, ...rest }) => rest))
    })

    it('should adapt tracks without playedAt field', () => {
      expect(
        adapterService.adaptTracks(
          spotifyTracksMock.map(({ played_at, ...rest }) => rest)
        )
      ).toEqual(formattedTracksMock.map(({ playedAt, ...rest }) => rest))
    })
  })

  it('should adapt profile', () => {
    expect(adapterService.adaptProfile(spotifyProfileMock)).toEqual(
      formattedProfileMock
    )
  })

  it('should adapt devices', () => {
    expect(adapterService.adaptDevices(spotifyDevicesMock)).toEqual(
      formattedDevicesMock
    )
  })

  it('should adapt playback state', () => {
    expect(adapterService.adaptPlaybackState(spotifyPlaybackStateMock)).toEqual(
      formattedPlaybackStateMock
    )
  })

  it('should adapt audio features', () => {
    expect(adapterService.adaptAudioFeatures(spotifyAudioFeaturesMock)).toEqual(
      formattedAudioFeaturesMock
    )
  })
})
