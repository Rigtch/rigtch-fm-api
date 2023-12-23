import { Test } from '@nestjs/testing'

import { UsersProfileController } from './users-profile.controller'
import { UsersRepository } from './users.repository'

import { AuthService } from '@modules/auth'
import { StatisticsService } from '@modules/statistics'
import { TimeRange } from '@modules/statistics/enums'
import {
  userMock,
  spotifyResponseWithCursorsMockFactory,
  tracksMock,
  topGenresMock,
  spotifyResponseWithOffsetMockFactory,
  artistsMock,
  analysisMock,
  playbackStateMock,
} from '@common/mocks'
import { SecretData } from '@modules/auth/dtos'
import { PlayerService } from '@modules/player'

describe('UsersProfileController', () => {
  const accessToken = 'accessToken'
  const id = '1'
  const limit = 10
  const before = 'before'
  const after = 'after'
  const offset = 0
  const timeRange = TimeRange.MEDIUM_TERM
  const secretDataMock: SecretData = {
    accessToken: accessToken,
    expiresIn: 3600,
  }

  let usersProfileController: UsersProfileController
  let usersRepository: UsersRepository
  let authService: AuthService
  let statisticsService: StatisticsService
  let playerService: PlayerService

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
          provide: AuthService,
          useValue: {
            token: vi.fn(),
          },
        },
        {
          provide: StatisticsService,
          useValue: {
            lastTracks: vi.fn(),
            topTracks: vi.fn(),
            topGenres: vi.fn(),
            topArtists: vi.fn(),
            analysis: vi.fn(),
          },
        },
        {
          provide: PlayerService,
          useValue: {
            currentPlaybackState: vi.fn(),
          },
        },
      ],
    }).compile()

    usersProfileController = module.get(UsersProfileController)
    usersRepository = module.get(UsersRepository)
    authService = module.get(AuthService)
    statisticsService = module.get(StatisticsService)
    playerService = module.get(PlayerService)
  })

  test('should be defined', () => {
    expect(usersProfileController).toBeDefined()
  })

  describe('getLastTracks', () => {
    test('should get user last tracks', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const lastTracksSpy = vi
        .spyOn(statisticsService, 'lastTracks')
        .mockResolvedValue(spotifyResponseWithCursorsMockFactory(tracksMock))

      expect(await usersProfileController.getLastTracks(id, {})).toEqual(
        spotifyResponseWithCursorsMockFactory(tracksMock)
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(lastTracksSpy).toHaveBeenCalled()
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(authService, 'token')
      const lastTracksSpy = vi.spyOn(statisticsService, 'lastTracks')

      await expect(
        usersProfileController.getLastTracks(id, {})
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(lastTracksSpy).not.toHaveBeenCalled()
    })

    test('should get user last tracks with query', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const lastTracksSpy = vi
        .spyOn(statisticsService, 'lastTracks')
        .mockResolvedValue(spotifyResponseWithCursorsMockFactory(tracksMock))

      expect(
        await usersProfileController.getLastTracks(id, {
          limit,
          before,
          after,
        })
      ).toEqual(spotifyResponseWithCursorsMockFactory(tracksMock))
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(lastTracksSpy).toHaveBeenCalledWith(
        accessToken,
        limit,
        before,
        after
      )
    })
  })

  describe('getTopGenres', () => {
    test('should get user top genres', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const topGenresSpy = vi
        .spyOn(statisticsService, 'topGenres')
        .mockResolvedValue(topGenresMock)

      expect(await usersProfileController.getTopGenres(id, {})).toEqual(
        topGenresMock
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(topGenresSpy).toHaveBeenCalled()
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(authService, 'token')
      const topGenresSpy = vi.spyOn(statisticsService, 'topGenres')

      await expect(
        usersProfileController.getTopGenres(id, {})
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(topGenresSpy).not.toHaveBeenCalled()
    })

    test('should get user top genres with query', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const topGenresSpy = vi
        .spyOn(statisticsService, 'topGenres')
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
      expect(topGenresSpy).toHaveBeenCalledWith(
        accessToken,
        limit,
        timeRange,
        offset
      )
    })
  })

  describe('getTopArtists', () => {
    test('should get user top artists', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const topArtistsSpy = vi
        .spyOn(statisticsService, 'topArtists')
        .mockResolvedValue(spotifyResponseWithOffsetMockFactory(artistsMock))

      expect(await usersProfileController.getTopArtists(id, {})).toEqual(
        spotifyResponseWithOffsetMockFactory(artistsMock)
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(topArtistsSpy).toHaveBeenCalled()
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(authService, 'token')
      const topArtistsSpy = vi.spyOn(statisticsService, 'topArtists')

      await expect(
        usersProfileController.getTopArtists(id, {})
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(topArtistsSpy).not.toHaveBeenCalled()
    })

    test('should get user top artists with query', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const topArtistsSpy = vi
        .spyOn(statisticsService, 'topArtists')
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
      expect(topArtistsSpy).toHaveBeenCalledWith(
        accessToken,
        limit,
        timeRange,
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
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const topTracksSpy = vi
        .spyOn(statisticsService, 'topTracks')
        .mockResolvedValue(spotifyResponseWithOffsetMockFactory(tracksMock))

      expect(await usersProfileController.getTopTracks(id, {})).toEqual(
        spotifyResponseWithOffsetMockFactory(tracksMock)
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(topTracksSpy).toHaveBeenCalled()
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(authService, 'token')
      const topTracksSpy = vi.spyOn(statisticsService, 'topTracks')

      await expect(
        usersProfileController.getTopTracks(id, {})
      ).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(topTracksSpy).not.toHaveBeenCalled()
    })

    test('should get user top tracks with query', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const topTracksSpy = vi
        .spyOn(statisticsService, 'topTracks')
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
      expect(topTracksSpy).toHaveBeenCalledWith(
        accessToken,
        limit,
        timeRange,
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
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const analysisSpy = vi
        .spyOn(statisticsService, 'analysis')
        .mockResolvedValue(analysisMock)

      expect(await usersProfileController.getAnalysis(id)).toEqual(analysisMock)
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(analysisSpy).toHaveBeenCalledWith(accessToken)
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

  describe('getState', () => {
    test('should get user playback state', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockResolvedValue(secretDataMock)
      const currentPlaybackStateSpy = vi
        .spyOn(playerService, 'currentPlaybackState')
        .mockResolvedValue(playbackStateMock)

      expect(await usersProfileController.getState(id)).toEqual(
        playbackStateMock
      )
      expect(currentPlaybackStateSpy).toHaveBeenCalledWith(accessToken)
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')

      await expect(usersProfileController.getState(id)).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })
  })
})
