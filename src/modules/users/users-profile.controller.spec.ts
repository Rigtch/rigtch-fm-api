import { Test } from '@nestjs/testing'
import { mock } from 'vitest-mock-extended'

import { UsersProfileController } from './users-profile.controller'
import { UsersRepository } from './users.repository'

import { TimeRange } from '@modules/spotify/users/enums'
import {
  spotifyResponseWithCursorsMockFactory,
  tracksMock,
  topGenresMock,
  spotifyResponseWithOffsetMockFactory,
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
  const id = '1'
  const limit = 10
  const before = 12_873
  const after = 945_384
  const offset = 0
  const timeRange = TimeRange.MEDIUM_TERM

  let usersProfileController: UsersProfileController
  let usersRepository: UsersRepository
  let spotifyAuthService: SpotifyAuthService
  let spotifyUsersService: SpotifyUsersService
  let spotifyPlayerService: SpotifyPlayerService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

    usersProfileController = module.get(UsersProfileController)
    usersRepository = module.get(UsersRepository)
    spotifyAuthService = module.get(SpotifyAuthService)
    spotifyUsersService = module.get(SpotifyUsersService)
    spotifyPlayerService = module.get(SpotifyPlayerService)
  })

  test('should be defined', () => {
    expect(usersProfileController).toBeDefined()
  })

  describe('getProfile', () => {
    const profileMock = mock<Profile>()

    test("should get user's profile", async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const profileSpy = vi
        .spyOn(spotifyUsersService, 'profile')
        .mockResolvedValue(profileMock)

      expect(await usersProfileController.getProfile(id, accessToken)).toEqual(
        profileMock
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')

      await expect(
        usersProfileController.getProfile(id, accessToken)
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })
  })

  describe('getRecentlyPlayedTracks', () => {
    test("should get user's recently played tracks", async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getRecentlyPlayedTracksSpy = vi
        .spyOn(spotifyPlayerService, 'getRecentlyPlayedTracks')
        .mockResolvedValue(spotifyResponseWithCursorsMockFactory(tracksMock))

      expect(await usersProfileController.getRecentlyPlayed(id, {})).toEqual(
        spotifyResponseWithCursorsMockFactory(tracksMock)
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(spotifyAuthService, 'token')
      const getRecentlyPlayedTracksSpy = vi.spyOn(
        spotifyPlayerService,
        'getRecentlyPlayedTracks'
      )

      await expect(
        usersProfileController.getRecentlyPlayed(id, {})
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getRecentlyPlayedTracksSpy).not.toHaveBeenCalled()
    })

    test("should get user's recently played tracks with query params", async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getRecentlyPlayedTracksSpy = vi
        .spyOn(spotifyPlayerService, 'getRecentlyPlayedTracks')
        .mockResolvedValue(spotifyResponseWithCursorsMockFactory(tracksMock))

      expect(
        await usersProfileController.getRecentlyPlayed(id, {
          limit,
          before,
          after,
        })
      ).toEqual(spotifyResponseWithCursorsMockFactory(tracksMock))
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        limit,
        before,
        after
      )
    })
  })

  describe('getTopArtists', () => {
    test('should get user top artists', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopArtistsSpy = vi
        .spyOn(spotifyUsersService, 'getTopArtists')
        .mockResolvedValue(spotifyResponseWithOffsetMockFactory(artistsMock))

      expect(await usersProfileController.getTopArtists(id, {})).toEqual(
        spotifyResponseWithOffsetMockFactory(artistsMock)
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopArtistsSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(spotifyAuthService, 'token')
      const getTopArtistsSpy = vi.spyOn(spotifyUsersService, 'getTopArtists')

      await expect(
        usersProfileController.getTopArtists(id, {})
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getTopArtistsSpy).not.toHaveBeenCalled()
    })

    test('should get user top artists with query', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopArtistsSpy = vi
        .spyOn(spotifyUsersService, 'getTopArtists')
        .mockResolvedValue(spotifyResponseWithOffsetMockFactory(artistsMock))

      expect(
        await usersProfileController.getTopArtists(id, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(spotifyResponseWithOffsetMockFactory(artistsMock))
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
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
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopTracksSpy = vi
        .spyOn(spotifyUsersService, 'getTopTracks')
        .mockResolvedValue(spotifyResponseWithOffsetMockFactory(tracksMock))

      expect(await usersProfileController.getTopTracks(id, {})).toEqual(
        spotifyResponseWithOffsetMockFactory(tracksMock)
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(spotifyAuthService, 'token')
      const getTopTracksSpy = vi.spyOn(spotifyUsersService, 'getTopTracks')

      await expect(
        usersProfileController.getTopTracks(id, {})
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getTopTracksSpy).not.toHaveBeenCalled()
    })

    test('should get user top tracks with query', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopTracksSpy = vi
        .spyOn(spotifyUsersService, 'getTopTracks')
        .mockResolvedValue(spotifyResponseWithOffsetMockFactory(tracksMock))

      expect(
        await usersProfileController.getTopTracks(id, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(spotifyResponseWithOffsetMockFactory(tracksMock))
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
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
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopGenresSpy = vi
        .spyOn(spotifyUsersService, 'getTopGenres')
        .mockResolvedValue(topGenresMock)

      expect(await usersProfileController.getTopGenres(id, {})).toEqual(
        topGenresMock
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(getTopGenresSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(spotifyAuthService, 'token')
      const getTopGenresSpy = vi.spyOn(spotifyUsersService, 'getTopGenres')

      await expect(
        usersProfileController.getTopGenres(id, {})
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getTopGenresSpy).not.toHaveBeenCalled()
    })

    test('should get user top genres with query', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getTopGenresSpy = vi
        .spyOn(spotifyUsersService, 'getTopGenres')
        .mockResolvedValue(topGenresMock)

      expect(
        await usersProfileController.getTopGenres(id, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(topGenresMock)
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
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
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getAnalysisSpy = vi
        .spyOn(spotifyUsersService, 'getAnalysis')
        .mockResolvedValue(analysisMock)

      expect(await usersProfileController.getAnalysis(id)).toEqual(analysisMock)
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getAnalysisSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')

      await expect(
        usersProfileController.getAnalysis(id)
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })
  })
})
