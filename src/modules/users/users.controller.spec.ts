import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test } from '@nestjs/testing'
import { of } from 'rxjs'

import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'

import {
  formattedTracksMock,
  spotifyResponseWithCursorsMockFactory,
  spotifyResponseWithOffsetMockFactory,
  userMock,
  usersMock,
} from '@common/mocks'
import { AuthService, SecretData } from '@modules/auth'
import { StatisticsService } from '@modules/statistics'
import { TimeRange } from '@modules/statistics/enums'

describe('UsersController', () => {
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
            findUsers: vi.fn(),
            findUserById: vi.fn(),
            findUserByProfileId: vi.fn(),
            findUserByDisplayName: vi.fn(),
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
      vi.spyOn(usersRepository, 'findUsers').mockResolvedValue(usersMock)

      expect(await usersController.getAll()).toEqual(usersMock)

      expect(usersRepository.findUsers).toHaveBeenCalled()
    })

    test('should get one user by username', async () => {
      vi.spyOn(usersRepository, 'findUserByDisplayName').mockResolvedValue(
        userMock
      )

      const username = 'username'

      expect(await usersController.getAll(username)).toEqual(userMock)

      expect(usersRepository.findUserByDisplayName).toHaveBeenCalledWith(
        username
      )
    })

    test('should throw an error if no user is found', async () => {
      vi.spyOn(usersRepository, 'findUserByDisplayName')

      const username = 'username'

      await expect(usersController.getAll(username)).rejects.toThrowError()
    })
  })

  describe('getOneById', () => {
    test('should get one user by id', async () => {
      vi.spyOn(usersRepository, 'findUserById').mockResolvedValue(userMock)

      const id = '1'

      expect(await usersController.getOneById(id)).toEqual(userMock)

      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
    })

    test('should throw an error if no user is found', async () => {
      vi.spyOn(usersRepository, 'findUserById')

      const id = '1'

      await expect(usersController.getOneById(id)).rejects.toThrowError()

      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
    })
  })

  describe('getOneByProfileId', () => {
    test('should get one user by profile id', async () => {
      vi.spyOn(usersRepository, 'findUserByProfileId').mockResolvedValue(
        userMock
      )

      const profileId = '1'

      expect(await usersController.getOneByProfileId(profileId)).toEqual(
        userMock
      )

      expect(usersRepository.findUserByProfileId).toHaveBeenCalledWith(
        profileId
      )
    })

    test('should throw an error if no user is found', async () => {
      vi.spyOn(usersRepository, 'findUserByProfileId')

      const profileId = '1'

      await expect(
        usersController.getOneByProfileId(profileId)
      ).rejects.toThrowError()

      expect(usersRepository.findUserByProfileId).toHaveBeenCalledWith(
        profileId
      )
    })
  })

  describe('getLastTracks', () => {
    test('should get user last tracks', async () => {
      vi.spyOn(usersRepository, 'findUserById').mockResolvedValue(userMock)
      vi.spyOn(authService, 'token').mockReturnValue(of(secretDataMock))
      vi.spyOn(statisticsService, 'lastTracks').mockReturnValue(
        of(spotifyResponseWithCursorsMockFactory(formattedTracksMock))
      )

      const id = '1'

      expect(await usersController.getLastTracks(id, {})).toEqual(
        spotifyResponseWithCursorsMockFactory(formattedTracksMock)
      )
      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
      expect(authService.token).toHaveBeenCalled()
      expect(statisticsService.lastTracks).toHaveBeenCalled()
    })

    test('should throw an error if no user is found', async () => {
      vi.spyOn(usersRepository, 'findUserById')
      vi.spyOn(authService, 'token')
      vi.spyOn(statisticsService, 'lastTracks')

      const id = '1'

      await expect(usersController.getLastTracks(id, {})).rejects.toThrowError()

      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
      expect(authService.token).not.toHaveBeenCalled()
      expect(statisticsService.lastTracks).not.toHaveBeenCalled()
    })

    test('should get user last tracks with query', async () => {
      vi.spyOn(usersRepository, 'findUserById').mockResolvedValue(userMock)
      vi.spyOn(authService, 'token').mockReturnValue(of(secretDataMock))
      vi.spyOn(statisticsService, 'lastTracks').mockReturnValue(
        of(spotifyResponseWithCursorsMockFactory(formattedTracksMock))
      )

      expect(
        await usersController.getLastTracks(id, {
          limit,
          before,
          after,
        })
      ).toEqual(spotifyResponseWithCursorsMockFactory(formattedTracksMock))
      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
      expect(authService.token).toHaveBeenCalled()
      expect(statisticsService.lastTracks).toHaveBeenCalledWith(
        accessToken,
        limit,
        before,
        after
      )
    })
  })

  describe('getTopTracks', () => {
    test('should get user top tracks', async () => {
      vi.spyOn(usersRepository, 'findUserById').mockResolvedValue(userMock)
      vi.spyOn(authService, 'token').mockReturnValue(of(secretDataMock))
      vi.spyOn(statisticsService, 'topTracks').mockReturnValue(
        of(spotifyResponseWithOffsetMockFactory(formattedTracksMock))
      )

      expect(await usersController.getTopTracks(id, {})).toEqual(
        spotifyResponseWithOffsetMockFactory(formattedTracksMock)
      )
      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
      expect(authService.token).toHaveBeenCalled()
      expect(statisticsService.topTracks).toHaveBeenCalled()
    })

    test('should throw an error if no user is found', async () => {
      vi.spyOn(usersRepository, 'findUserById')
      vi.spyOn(authService, 'token')
      vi.spyOn(statisticsService, 'topTracks')

      const id = '1'

      await expect(usersController.getTopTracks(id, {})).rejects.toThrowError()

      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
      expect(authService.token).not.toHaveBeenCalled()
      expect(statisticsService.topTracks).not.toHaveBeenCalled()
    })

    test('should get user top tracks with query', async () => {
      vi.spyOn(usersRepository, 'findUserById').mockResolvedValue(userMock)
      vi.spyOn(authService, 'token').mockReturnValue(of(secretDataMock))
      vi.spyOn(statisticsService, 'topTracks').mockReturnValue(
        of(spotifyResponseWithOffsetMockFactory(formattedTracksMock))
      )

      expect(
        await usersController.getTopTracks(id, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(spotifyResponseWithOffsetMockFactory(formattedTracksMock))
      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
      expect(authService.token).toHaveBeenCalled()
      expect(statisticsService.topTracks).toHaveBeenCalledWith(
        accessToken,
        limit,
        timeRange,
        offset
      )
    })
  })
})
