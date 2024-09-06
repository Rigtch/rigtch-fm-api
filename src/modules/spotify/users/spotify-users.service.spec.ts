import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import { SpotifyUsersService } from './spotify-users.service'
import { TimeRange } from './enums'

import { EnvService } from '@config/env'
import { AdaptersModule } from '@common/adapters'
import {
  accessTokenMock,
  analysisMock,
  artistsMock,
  audioFeaturesMock,
  pageMockFactory,
  profileMock,
  sdkArtistsMock,
  sdkProfileMock,
  sdkTracksMock,
  tracksMock,
} from '@common/mocks'
import { getMostFrequentItems } from '@common/utils'

vi.mock('@spotify/web-api-ts-sdk', () => {
  const spotifyApiConstructor = vi.fn().mockReturnValue({
    currentUser: {
      profile: vi.fn(),
      topItems: vi.fn(),
    },
    tracks: {
      audioFeatures: vi.fn(),
    },
  })

  return {
    SpotifyApi: Object.assign(spotifyApiConstructor, {
      withAccessToken: vi.fn().mockReturnThis(),
    }),
  }
})

describe('SpotifyUsersService', () => {
  let moduleRef: TestingModule
  let spotifyUsersService: SpotifyUsersService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AdaptersModule],
      providers: [
        SpotifyUsersService,
        {
          provide: EnvService,
          useValue: {
            get: vi.fn().mockReturnValue('clientId'),
          },
        },
      ],
    }).compile()

    spotifyUsersService = moduleRef.get(SpotifyUsersService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(spotifyUsersService).toBeDefined()
  })

  describe('profile', () => {
    let withAccessTokenSpy: MockInstance
    let getProfileMock: MockInstance

    beforeEach(() => {
      getProfileMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          currentUser: {
            profile: getProfileMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return a profile', async () => {
      getProfileMock.mockResolvedValue(sdkProfileMock)

      const profile = await spotifyUsersService.profile(accessTokenMock)

      expect(profile).toEqual(profileMock)

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getProfileMock).toHaveBeenCalledWith()
    })
  })

  describe('getTopArtists', () => {
    let withAccessTokenSpy: MockInstance
    let getTopArtistsMock: MockInstance

    beforeEach(() => {
      getTopArtistsMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          currentUser: {
            topItems: getTopArtistsMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return a top artists page', async () => {
      getTopArtistsMock.mockResolvedValue(pageMockFactory(sdkArtistsMock))

      const topArtistsPage = await spotifyUsersService.getTopArtists(
        accessTokenMock,
        {},
        false
      )

      expect(topArtistsPage).toEqual(pageMockFactory(sdkArtistsMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopArtistsMock).toHaveBeenCalledWith(
        'artists',
        TimeRange.LONG_TERM,
        20,
        0
      )
    })

    test('should return a top artists page with limit', async () => {
      const limit = 10

      getTopArtistsMock.mockResolvedValue(pageMockFactory(sdkArtistsMock))

      const topArtistsPage = await spotifyUsersService.getTopArtists(
        accessTokenMock,
        { limit },
        false
      )

      expect(topArtistsPage).toEqual(pageMockFactory(sdkArtistsMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopArtistsMock).toHaveBeenCalledWith(
        'artists',
        TimeRange.LONG_TERM,
        limit,
        0
      )
    })

    test('should return a top artists page with offset', async () => {
      const offset = 10

      getTopArtistsMock.mockResolvedValue(pageMockFactory(sdkArtistsMock))

      const topArtistsPage = await spotifyUsersService.getTopArtists(
        accessTokenMock,
        {
          offset,
        },
        false
      )

      expect(topArtistsPage).toEqual(pageMockFactory(sdkArtistsMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopArtistsMock).toHaveBeenCalledWith(
        'artists',
        TimeRange.LONG_TERM,
        20,
        offset
      )
    })

    test('should return a top artists page with time range', async () => {
      getTopArtistsMock.mockResolvedValue(pageMockFactory(sdkArtistsMock))

      const topArtistsPage = await spotifyUsersService.getTopArtists(
        accessTokenMock,
        {
          timeRange: TimeRange.SHORT_TERM,
        },
        false
      )

      expect(topArtistsPage).toEqual(pageMockFactory(sdkArtistsMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopArtistsMock).toHaveBeenCalledWith(
        'artists',
        TimeRange.SHORT_TERM,
        20,
        0
      )
    })

    test('should return an adapted top artists page', async () => {
      getTopArtistsMock.mockResolvedValue(pageMockFactory(sdkArtistsMock))

      const topArtistsPage = await spotifyUsersService.getTopArtists(
        accessTokenMock,
        {},
        true
      )

      expect(topArtistsPage).toEqual(pageMockFactory(artistsMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopArtistsMock).toHaveBeenCalledWith(
        'artists',
        TimeRange.LONG_TERM,
        20,
        0
      )
    })
  })

  describe('getTopTracks', () => {
    let withAccessTokenSpy: MockInstance
    let getTopTracksMock: MockInstance

    beforeEach(() => {
      getTopTracksMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          currentUser: {
            topItems: getTopTracksMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return a top tracks page', async () => {
      getTopTracksMock.mockResolvedValue(pageMockFactory(sdkTracksMock))

      const topTracksPage = await spotifyUsersService.getTopTracks(
        accessTokenMock,
        {},
        false
      )

      expect(topTracksPage).toEqual(pageMockFactory(sdkTracksMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopTracksMock).toHaveBeenCalledWith(
        'tracks',
        TimeRange.LONG_TERM,
        20,
        0
      )
    })

    test('should return a top tracks page with limit', async () => {
      const limit = 10

      getTopTracksMock.mockResolvedValue(pageMockFactory(sdkTracksMock))

      const topTracksPage = await spotifyUsersService.getTopTracks(
        accessTokenMock,
        { limit },
        false
      )

      expect(topTracksPage).toEqual(pageMockFactory(sdkTracksMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopTracksMock).toHaveBeenCalledWith(
        'tracks',
        TimeRange.LONG_TERM,
        limit,
        0
      )
    })

    test('should return a top tracks page with offset', async () => {
      const offset = 10

      getTopTracksMock.mockResolvedValue(pageMockFactory(sdkTracksMock))

      const topTracksPage = await spotifyUsersService.getTopTracks(
        accessTokenMock,
        {
          offset,
        },
        false
      )

      expect(topTracksPage).toEqual(pageMockFactory(sdkTracksMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopTracksMock).toHaveBeenCalledWith(
        'tracks',
        TimeRange.LONG_TERM,
        20,
        offset
      )
    })

    test('should return a top tracks page with time range', async () => {
      getTopTracksMock.mockResolvedValue(pageMockFactory(sdkTracksMock))

      const topTracksPage = await spotifyUsersService.getTopTracks(
        accessTokenMock,
        {
          timeRange: TimeRange.SHORT_TERM,
        },
        false
      )

      expect(topTracksPage).toEqual(pageMockFactory(sdkTracksMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopTracksMock).toHaveBeenCalledWith(
        'tracks',
        TimeRange.SHORT_TERM,
        20,
        0
      )
    })

    test('should return an adapted top tracks page', async () => {
      getTopTracksMock.mockResolvedValue(pageMockFactory(sdkTracksMock))

      const topTracksPage = await spotifyUsersService.getTopTracks(
        accessTokenMock,
        {},
        true
      )

      expect(topTracksPage).toEqual(pageMockFactory(tracksMock))

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopTracksMock).toHaveBeenCalledWith(
        'tracks',
        TimeRange.LONG_TERM,
        20,
        0
      )
    })
  })

  describe('getTopGenres', () => {
    let withAccessTokenSpy: MockInstance
    let getTopGenresMock: MockInstance

    beforeEach(() => {
      getTopGenresMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          currentUser: {
            topItems: getTopGenresMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return a top genres page', async () => {
      getTopGenresMock.mockResolvedValue(pageMockFactory(sdkArtistsMock))

      const topGenresPage = await spotifyUsersService.getTopGenres(
        accessTokenMock,
        TimeRange.LONG_TERM,
        20,
        0
      )

      expect(topGenresPage).toEqual({
        genres: getMostFrequentItems(
          sdkArtistsMock.flatMap(({ genres }) => genres),
          20
        ).map(({ item }) => item),
      })

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopGenresMock).toHaveBeenCalledWith(
        'artists',
        TimeRange.LONG_TERM,
        50,
        0
      )
    })

    test('should return a top genres page with limit', async () => {
      const limit = 10

      getTopGenresMock.mockResolvedValue(pageMockFactory(sdkArtistsMock))

      const topGenresPage = await spotifyUsersService.getTopGenres(
        accessTokenMock,
        TimeRange.LONG_TERM,
        limit,
        0
      )

      expect(topGenresPage).toEqual({
        genres: getMostFrequentItems(
          sdkArtistsMock.flatMap(({ genres }) => genres),
          limit
        ).map(({ item }) => item),
      })

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getTopGenresMock).toHaveBeenCalledWith(
        'artists',
        TimeRange.LONG_TERM,
        50,
        0
      )
    })
  })

  describe('getAnalysis', () => {
    let withAccessTokenSpy: MockInstance
    let getAnalysisMock: MockInstance
    let getTopTracksMock: MockInstance

    beforeEach(() => {
      getAnalysisMock = vi.fn()
      getTopTracksMock = vi.fn()

      withAccessTokenSpy = vi
        .spyOn(SpotifyApi, 'withAccessToken')
        .mockReturnValue({
          currentUser: {
            topItems: getTopTracksMock,
          },
          tracks: {
            audioFeatures: getAnalysisMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return an analysis page', async () => {
      getTopTracksMock.mockResolvedValue(pageMockFactory(sdkTracksMock))
      getAnalysisMock.mockResolvedValue([audioFeaturesMock])

      const analysisPage = await spotifyUsersService.getAnalysis(
        accessTokenMock,
        TimeRange.LONG_TERM
      )

      expect(analysisPage).toEqual(analysisMock)

      expect(withAccessTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        accessTokenMock
      )
      expect(getAnalysisMock).toHaveBeenCalledWith(
        sdkTracksMock.map(track => track.id)
      )
    })
  })
})
