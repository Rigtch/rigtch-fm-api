import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'

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
import { Profile } from '@common/types/spotify'
import { SpotifyService } from '@modules/spotify'

describe('UsersProfileController', () => {
  const limit = 10
  const before = 12_873
  const after = 945_384
  const offset = 0
  const timeRange = TimeRange.MEDIUM_TERM

  let moduleRef: TestingModule
  let usersProfileController: UsersProfileController
  let spotifyService: SpotifyService

  let tokenSpy: MockInstance

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
          provide: SpotifyService,
          useValue: {
            auth: {
              token: vi.fn(),
            },
            users: {
              profile: vi.fn(),
              getTopArtists: vi.fn(),
              getTopTracks: vi.fn(),
              getTopGenres: vi.fn(),
              getAnalysis: vi.fn(),
            },
            player: {
              getRecentlyPlayedTracks: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    usersProfileController = moduleRef.get(UsersProfileController)
    spotifyService = moduleRef.get(SpotifyService)

    tokenSpy = vi
      .spyOn(spotifyService.auth, 'token')
      .mockResolvedValue(accessTokenMock)
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
      const profileSpy = vi
        .spyOn(spotifyService.users, 'profile')
        .mockResolvedValue(profileMock)

      expect(
        await usersProfileController.getProfile(userMock, accessToken)
      ).toEqual(profileMock)

      expect(tokenSpy).toHaveBeenCalled()
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })

  describe('getRecentlyPlayedTracks', () => {
    let getRecentlyPlayedTracksSpy: MockInstance

    beforeEach(() => {
      getRecentlyPlayedTracksSpy = vi
        .spyOn(spotifyService.player, 'getRecentlyPlayedTracks')
        .mockResolvedValue(recentlyPlayedTracksPageMockFactory(tracksMock))
    })

    test("should get user's recently played tracks", async () => {
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
    let getTopArtistsSpy: MockInstance

    beforeEach(() => {
      getTopArtistsSpy = vi
        .spyOn(spotifyService.users, 'getTopArtists')
        .mockResolvedValue(pageMockFactory(artistsMock))
    })

    test('should get user top artists', async () => {
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
    let getTopTracksSpy: MockInstance

    beforeEach(() => {
      getTopTracksSpy = vi
        .spyOn(spotifyService.users, 'getTopTracks')
        .mockResolvedValue(pageMockFactory(tracksMock))
    })

    test('should get user top tracks', async () => {
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
    let getTopGenresSpy: MockInstance

    beforeEach(() => {
      getTopGenresSpy = vi
        .spyOn(spotifyService.users, 'getTopGenres')
        .mockResolvedValue(topGenresMock)
    })

    test('should get user top genres', async () => {
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
    let getAnalysisSpy: MockInstance

    beforeEach(() => {
      getAnalysisSpy = vi
        .spyOn(spotifyService.users, 'getAnalysis')
        .mockResolvedValue(analysisMock)
    })

    test('should get user analysis', async () => {
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
