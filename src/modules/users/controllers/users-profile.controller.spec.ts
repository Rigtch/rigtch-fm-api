import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'vitest-mock-extended'

import { UsersRepository } from '../users.repository'

import { UsersProfileController } from './users-profile.controller'

import { TimeRange } from '@modules/spotify/users/enums'
import {
  recentlyPlayedTracksPageMockFactory,
  tracksMock,
  topGenresMock,
  pageMockFactory,
  artistsMock,
  analysisMock,
  userMock,
  accessToken,
  accessTokenMock,
} from '@common/mocks'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyUsersService } from '@modules/spotify/users'
import { SpotifyPlayerService } from '@modules/spotify/player'
import { Profile } from '@common/types/spotify'

describe('UsersProfileController', () => {
  const limit = 10
  const before = 12_873
  const after = 945_384
  const offset = 0
  const timeRange = TimeRange.MEDIUM_TERM

  let moduleRef: TestingModule
  let usersProfileController: UsersProfileController
  let spotifyAuthService: SpotifyAuthService
  let spotifyUsersService: SpotifyUsersService
  let spotifyPlayerService: SpotifyPlayerService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        UsersProfileController,
        {
          provide: UsersRepository,
          useValue: {
            find: vi.fn(),
            findOneBy: vi.fn(),
            findOneByDisplayName: vi.fn(),
          },
        },
        {
          provide: SpotifyAuthService,
          useValue: {
            token: vi.fn(),
          },
        },
        {
          provide: SpotifyUsersService,
          useValue: {
            profile: vi.fn(),
            getTopArtists: vi.fn(),
            getTopTracks: vi.fn(),
            getTopGenres: vi.fn(),
            getAnalysis: vi.fn(),
          },
        },
        {
          provide: SpotifyPlayerService,
          useValue: {
            getRecentlyPlayedTracks: vi.fn(),
          },
        },
      ],
    }).compile()

    usersProfileController = moduleRef.get(UsersProfileController)
    spotifyAuthService = moduleRef.get(SpotifyAuthService)
    spotifyUsersService = moduleRef.get(SpotifyUsersService)
    spotifyPlayerService = moduleRef.get(SpotifyPlayerService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(usersProfileController).toBeDefined()
  })

  describe('getProfile', () => {
    const profileMock = mock<Profile>()

    test("should get user's profile", async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const profileSpy = vi
        .spyOn(spotifyUsersService, 'profile')
        .mockResolvedValue(profileMock)

      expect(
        await usersProfileController.getProfile(userMock, accessToken)
      ).toEqual(profileMock)

      expect(tokenSpy).toHaveBeenCalled()
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })

  describe('getRecentlyPlayedTracks', () => {
    test("should get user's recently played tracks", async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getRecentlyPlayedTracksSpy = vi
        .spyOn(spotifyPlayerService, 'getRecentlyPlayedTracks')
        .mockResolvedValue(recentlyPlayedTracksPageMockFactory(tracksMock))

      expect(
        await usersProfileController.getRecentlyPlayed(userMock, {})
      ).toEqual(recentlyPlayedTracksPageMockFactory(tracksMock))

      expect(tokenSpy).toHaveBeenCalled()
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        10,
        {}
      )
    })

    test("should get user's recently played tracks with query params", async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getRecentlyPlayedTracksSpy = vi
        .spyOn(spotifyPlayerService, 'getRecentlyPlayedTracks')
        .mockResolvedValue(recentlyPlayedTracksPageMockFactory(tracksMock))

      expect(
        await usersProfileController.getRecentlyPlayed(userMock, {
          limit,
          before,
          after,
        })
      ).toEqual(recentlyPlayedTracksPageMockFactory(tracksMock))

      expect(tokenSpy).toHaveBeenCalled()
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        limit,
        { before, after }
      )
    })
  })

  describe('getTopArtists', () => {
    test('should get user top artists', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopArtistsSpy = vi
        .spyOn(spotifyUsersService, 'getTopArtists')
        .mockResolvedValue(pageMockFactory(artistsMock))

      expect(await usersProfileController.getTopArtists(userMock, {})).toEqual(
        pageMockFactory(artistsMock)
      )

      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopArtistsSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should get user top artists with query', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopArtistsSpy = vi
        .spyOn(spotifyUsersService, 'getTopArtists')
        .mockResolvedValue(pageMockFactory(artistsMock))

      expect(
        await usersProfileController.getTopArtists(userMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(pageMockFactory(artistsMock))

      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopArtistsSpy).toHaveBeenCalledWith(
        accessTokenMock,
        timeRange,
        limit,
        offset
      )
    })
  })

  describe('getTopTracks', () => {
    test('should get user top tracks', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopTracksSpy = vi
        .spyOn(spotifyUsersService, 'getTopTracks')
        .mockResolvedValue(pageMockFactory(tracksMock))

      expect(await usersProfileController.getTopTracks(userMock, {})).toEqual(
        pageMockFactory(tracksMock)
      )

      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should get user top tracks with query', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopTracksSpy = vi
        .spyOn(spotifyUsersService, 'getTopTracks')
        .mockResolvedValue(pageMockFactory(tracksMock))

      expect(
        await usersProfileController.getTopTracks(userMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(pageMockFactory(tracksMock))

      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        timeRange,
        limit,
        offset
      )
    })
  })

  describe('getTopGenres', () => {
    test('should get user top genres', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopGenresSpy = vi
        .spyOn(spotifyUsersService, 'getTopGenres')
        .mockResolvedValue(topGenresMock)

      expect(await usersProfileController.getTopGenres(userMock, {})).toEqual(
        topGenresMock
      )

      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopGenresSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should get user top genres with query', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopGenresSpy = vi
        .spyOn(spotifyUsersService, 'getTopGenres')
        .mockResolvedValue(topGenresMock)

      expect(
        await usersProfileController.getTopGenres(userMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(topGenresMock)

      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopGenresSpy).toHaveBeenCalledWith(
        accessTokenMock,
        timeRange,
        limit,
        offset
      )
    })
  })

  describe('getAnalysis', () => {
    test('should get user analysis', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getAnalysisSpy = vi
        .spyOn(spotifyUsersService, 'getAnalysis')
        .mockResolvedValue(analysisMock)

      expect(await usersProfileController.getAnalysis(userMock)).toEqual(
        analysisMock
      )

      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getAnalysisSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })
})
