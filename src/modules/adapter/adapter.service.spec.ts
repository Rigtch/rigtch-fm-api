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
} from '~/common/mocks'

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
})
