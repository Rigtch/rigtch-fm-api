import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { UsersRepository } from '../users.repository'
import { MeBody } from '../dtos'

import { UsersController } from './users.controller'

import {
  accessTokenMock,
  profileMock,
  userMock,
  usersMock,
} from '@common/mocks'
import { ProfilesRepository } from '@modules/profiles'
import { SpotifyService } from '@modules/spotify'
import { HistoryScheduler } from '@modules/history'

describe('UsersController', () => {
  let moduleRef: TestingModule
  let usersController: UsersController
  let usersRepository: UsersRepository
  let profilesRepository: ProfilesRepository
  let spotifyService: SpotifyService
  let historyScheduler: HistoryScheduler

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        UsersController,
        {
          provide: UsersRepository,
          useValue: {
            findUsers: vi.fn(),
            findUserById: vi.fn(),
            findUserByProfileId: vi.fn(),
            createUser: vi.fn(),
            update: vi.fn(),
          },
        },
        {
          provide: ProfilesRepository,
          useValue: {
            createProfile: vi.fn(),
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
            },
          },
        },
        {
          provide: HistoryScheduler,
          useValue: {
            scheduleHistorySynchronizationForUser: vi.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: vi.fn(),
      })
      .compile()

    usersController = moduleRef.get(UsersController)
    usersRepository = moduleRef.get(UsersRepository)
    profilesRepository = moduleRef.get(ProfilesRepository)
    spotifyService = moduleRef.get(SpotifyService)
    historyScheduler = moduleRef.get(HistoryScheduler)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('getAll', () => {
    test('should get all users', async () => {
      const findSpy = vi
        .spyOn(usersRepository, 'findUsers')
        .mockResolvedValue(usersMock)

      expect(await usersController.getAll()).toEqual(usersMock)

      expect(findSpy).toHaveBeenCalled()
    })
  })

  describe('getMe', () => {
    const body: MeBody = {
      refreshToken: 'refreshToken',
    }

    let tokenSpy: MockInstance
    let profileSpy: MockInstance
    let findUserByProfileIdSpy: MockInstance
    let createProfileSpy: MockInstance
    let createUserSpy: MockInstance
    let updateSpy: MockInstance
    let scheduleHistorySynchronizationForUserSpy: MockInstance

    beforeEach(() => {
      tokenSpy = vi
        .spyOn(spotifyService.auth, 'token')
        .mockResolvedValue(accessTokenMock)
      profileSpy = vi
        .spyOn(spotifyService.users, 'profile')
        .mockResolvedValue(profileMock)
      findUserByProfileIdSpy = vi.spyOn(usersRepository, 'findUserByProfileId')
      createProfileSpy = vi.spyOn(profilesRepository, 'createProfile')
      createUserSpy = vi.spyOn(usersRepository, 'createUser')
      updateSpy = vi.spyOn(usersRepository, 'update')
      scheduleHistorySynchronizationForUserSpy = vi.spyOn(
        historyScheduler,
        'scheduleHistorySynchronizationForUser'
      )
    })

    test('should get me', async () => {
      findUserByProfileIdSpy.mockResolvedValue(userMock)

      expect(await usersController.getMe(body)).toEqual(userMock)

      expect(tokenSpy).toHaveBeenCalledWith(body)
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findUserByProfileIdSpy).toHaveBeenCalledWith(profileMock.id)
      expect(updateSpy).toHaveBeenCalledWith(userMock.id, body)
      expect(createProfileSpy).not.toHaveBeenCalled()
      expect(createUserSpy).not.toHaveBeenCalled()
      expect(scheduleHistorySynchronizationForUserSpy).not.toHaveBeenCalled()
    })

    test('should get me and create user', async () => {
      findUserByProfileIdSpy.mockResolvedValue(null)
      createProfileSpy.mockResolvedValue(profileMock)
      createUserSpy.mockResolvedValue(userMock)

      expect(await usersController.getMe(body)).toEqual(userMock)

      expect(tokenSpy).toHaveBeenCalledWith(body)
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findUserByProfileIdSpy).toHaveBeenCalledWith(profileMock.id)
      expect(createProfileSpy).toHaveBeenCalledWith(profileMock)
      expect(createUserSpy).toHaveBeenCalledWith({
        profile: profileMock,
        refreshToken: body.refreshToken,
      })
      expect(scheduleHistorySynchronizationForUserSpy).toHaveBeenCalledWith(
        userMock
      )
      expect(updateSpy).not.toHaveBeenCalled()
    })
  })

  describe('getOneById', () => {
    test('should get one user by id', () => {
      expect(usersController.getOneById(userMock)).toEqual(userMock)
    })
  })
})
