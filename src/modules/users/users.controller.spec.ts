import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test } from '@nestjs/testing'
import { of } from 'rxjs'

import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'

import {
  artistsMock,
  tracksMock,
  spotifyResponseWithCursorsMockFactory,
  spotifyResponseWithOffsetMockFactory,
  topGenresMock,
  userMock,
  usersMock,
} from '@common/mocks'
import { AuthService, SecretData } from '@modules/auth'
import { StatisticsService } from '@modules/statistics'
import { TimeRange } from '@modules/statistics/enums'

describe('UsersController', () => {
  const accessToken = 'accessToken'
  const id = '1'
  const username = 'username'
  const limit = 10
  const before = 'before'
  const after = 'after'
  const offset = 0
  const timeRange = TimeRange.MEDIUM_TERM
  const secretDataMock: SecretData = {
    accessToken: accessToken,
    expiresIn: 3600,
  }

  let usersController: UsersController
  let usersRepository: UsersRepository
  let authService: AuthService
  let statisticsService: StatisticsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersController,
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
          },
        },
      ],
    }).compile()

    usersController = module.get(UsersController)
    usersRepository = module.get(UsersRepository)
    authService = module.get(AuthService)
    statisticsService = module.get(StatisticsService)
  })

  test('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('getAll', () => {
    test('should get all users', async () => {
      const findSpy = vi
        .spyOn(usersRepository, 'find')
        .mockResolvedValue(usersMock)

      expect(await usersController.getAll()).toEqual(usersMock)

      expect(findSpy).toHaveBeenCalled()
    })

    test('should get one user by username', async () => {
      const findOneByDisplayNameSpy = vi
        .spyOn(usersRepository, 'findOneByDisplayName')
        .mockResolvedValue(userMock)

      expect(await usersController.getAll(username)).toEqual(userMock)

      expect(findOneByDisplayNameSpy).toHaveBeenCalledWith(username)
    })

    test('should throw an error if no user is found', () => {
      const findOneByDisplayNameSpy = vi.spyOn(
        usersRepository,
        'findOneByDisplayName'
      )

      expect(usersController.getAll(username)).rejects.toThrowError()
      expect(findOneByDisplayNameSpy).toHaveBeenCalledWith(username)
    })
  })

  describe('getOneById', () => {
    test('should get one user by id', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)

      expect(await usersController.getOneById(id)).toEqual(userMock)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })

    test('should throw an error if no user is found', () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')

      expect(usersController.getOneById(id)).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })
  })

  describe('getLastTracks', () => {
    test('should get user last tracks', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockReturnValue(of(secretDataMock))
      const lastTracksSpy = vi
        .spyOn(statisticsService, 'lastTracks')
        .mockReturnValue(of(spotifyResponseWithCursorsMockFactory(tracksMock)))

      expect(await usersController.getLastTracks(id, {})).toEqual(
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

      await expect(usersController.getLastTracks(id, {})).rejects.toThrowError()

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
        .mockReturnValue(of(secretDataMock))
      const lastTracksSpy = vi
        .spyOn(statisticsService, 'lastTracks')
        .mockReturnValue(of(spotifyResponseWithCursorsMockFactory(tracksMock)))

      expect(
        await usersController.getLastTracks(id, {
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

  describe('getTopTracks', () => {
    test('should get user top tracks', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockReturnValue(of(secretDataMock))
      const topTracksSpy = vi
        .spyOn(statisticsService, 'topTracks')
        .mockReturnValue(of(spotifyResponseWithOffsetMockFactory(tracksMock)))

      expect(await usersController.getTopTracks(id, {})).toEqual(
        spotifyResponseWithOffsetMockFactory(tracksMock)
      )
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(topTracksSpy).toHaveBeenCalled()
    })

    test('should throw an error if no user is found', () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(authService, 'token')
      const topTracksSpy = vi.spyOn(statisticsService, 'topTracks')

      expect(usersController.getTopTracks(id, {})).rejects.toThrowError()

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
        .mockReturnValue(of(secretDataMock))
      const topTracksSpy = vi
        .spyOn(statisticsService, 'topTracks')
        .mockReturnValue(of(spotifyResponseWithOffsetMockFactory(tracksMock)))

      expect(
        await usersController.getTopTracks(id, {
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

  describe('getTopGenres', () => {
    test('should get user top genres', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockReturnValue(of(secretDataMock))
      const topGenresSpy = vi
        .spyOn(statisticsService, 'topGenres')
        .mockReturnValue(of(topGenresMock))

      expect(await usersController.getTopGenres(id, {})).toEqual(topGenresMock)
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalled()
      expect(topGenresSpy).toHaveBeenCalled()
    })

    test('should throw an error if no user is found', () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      const tokenSpy = vi.spyOn(authService, 'token')
      const topGenresSpy = vi.spyOn(statisticsService, 'topGenres')

      expect(usersController.getTopGenres(id, {})).rejects.toThrowError()

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
        .mockReturnValue(of(secretDataMock))
      const topGenresSpy = vi
        .spyOn(statisticsService, 'topGenres')
        .mockReturnValue(of(topGenresMock))

      expect(
        await usersController.getTopGenres(id, {
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
        .mockReturnValue(of(secretDataMock))
      const topArtistsSpy = vi
        .spyOn(statisticsService, 'topArtists')
        .mockReturnValue(of(spotifyResponseWithOffsetMockFactory(artistsMock)))

      expect(await usersController.getTopArtists(id, {})).toEqual(
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

      await expect(usersController.getTopArtists(id, {})).rejects.toThrowError()

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
        .mockReturnValue(of(secretDataMock))
      const topArtistsSpy = vi
        .spyOn(statisticsService, 'topArtists')
        .mockReturnValue(of(spotifyResponseWithOffsetMockFactory(artistsMock)))

      expect(
        await usersController.getTopArtists(id, {
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
})
