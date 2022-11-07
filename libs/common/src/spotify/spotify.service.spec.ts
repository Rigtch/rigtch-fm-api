import { TestingModule, Test } from '@nestjs/testing'

import {
  formattedTracksMock,
  spotifyArtistsMock,
  spotifyTracksMock,
  formattedArtistsMock,
  spotifyProfileMock,
  formattedProfileMock,
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

  it('should format tracks', () => {
    expect(spotifyService.formatTracks(spotifyTracksMock)).toEqual(
      formattedTracksMock
    )
  })

  it('should format profile', () => {
    expect(spotifyService.formatProfile(spotifyProfileMock)).toEqual(
      formattedProfileMock
    )
  })
})
