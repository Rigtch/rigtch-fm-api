import { Test, TestingModule } from '@nestjs/testing'
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
  accessTokenMock,
  userMock,
} from '@common/mocks'
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
            users: {
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
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(usersProfileController).toBeDefined()
  })

  describe('getProfile', () => {
    test("should get user's profile", () => {
      expect(usersProfileController.getProfile(userMock)).toEqual(
        userMock.profile
      )
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
        await usersProfileController.getRecentlyPlayed(accessTokenMock, {})
      ).toEqual(recentlyPlayedTracksPageMockFactory(tracksMock))

      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        10,
        {}
      )
    })

    test("should get user's recently played tracks with query params", async () => {
      expect(
        await usersProfileController.getRecentlyPlayed(accessTokenMock, {
          limit,
          before,
          after,
        })
      ).toEqual(recentlyPlayedTracksPageMockFactory(tracksMock))

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
      expect(
        await usersProfileController.getTopArtists(accessTokenMock, {})
      ).toEqual(pageMockFactory(artistsMock))

      expect(getTopArtistsSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should get user top artists with query', async () => {
      expect(
        await usersProfileController.getTopArtists(accessTokenMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(pageMockFactory(artistsMock))

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
      expect(
        await usersProfileController.getTopTracks(accessTokenMock, {})
      ).toEqual(pageMockFactory(tracksMock))

      expect(getTopTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should get user top tracks with query', async () => {
      expect(
        await usersProfileController.getTopTracks(accessTokenMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(pageMockFactory(tracksMock))

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
      expect(
        await usersProfileController.getTopGenres(accessTokenMock, {})
      ).toEqual(topGenresMock)

      expect(getTopGenresSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should get user top genres with query', async () => {
      expect(
        await usersProfileController.getTopGenres(accessTokenMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(topGenresMock)

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
      expect(await usersProfileController.getAnalysis(accessTokenMock)).toEqual(
        analysisMock
      )

      expect(getAnalysisSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })
})
