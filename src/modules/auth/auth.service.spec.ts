import { Test } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { FindManyOptions } from 'typeorm'

import { AuthService } from './auth.service'

import { accessToken, refreshToken } from '@common/mocks'
import { profileMock, userMock, accessTokenMock } from '@common/mocks'
import { User, UsersRepository } from '@modules/users'
import { ProfilesRepository } from '@modules/profiles'
import { SpotifyUsersService } from '@modules/spotify/users'
import { HistoryScheduler } from '@modules/history'

describe('AuthService', () => {
  let authService: AuthService
  let usersRepository: UsersRepository
  let profilesRepository: ProfilesRepository
  let spotifyUsersService: SpotifyUsersService
  let historyScheduler: HistoryScheduler

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findUserByProfileId: vi.fn(),
            createUser: vi.fn(),
            count: vi.fn(),
          },
        },
        {
          provide: ProfilesRepository,
          useValue: {
            createProfile: vi.fn(),
          },
        },
        {
          provide: SpotifyUsersService,
          useValue: {
            profile: vi.fn(),
          },
        },
        {
          provide: HistoryScheduler,
          useValue: {
            triggerFetchingUserHistory: vi.fn(),
          },
        },
      ],
    }).compile()

    authService = module.get(AuthService)
    usersRepository = module.get(UsersRepository)
    profilesRepository = module.get(ProfilesRepository)
    spotifyUsersService = module.get(SpotifyUsersService)
    historyScheduler = module.get(HistoryScheduler)
  })

  test('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('saveUser', () => {
    const count = 2
    let countSpy: MockInstance<
      [options?: FindManyOptions<User>],
      Promise<number>
    >

    beforeEach(() => {
      countSpy = vi.spyOn(usersRepository, 'count').mockResolvedValue(count)
    })

    test('should create new user', async () => {
      const profileSpy = vi
        .spyOn(spotifyUsersService, 'profile')
        .mockResolvedValue(profileMock)
      const findOneByProfileIdSpy = vi.spyOn(
        usersRepository,
        'findUserByProfileId'
      )
      const createProfileSpy = vi
        .spyOn(profilesRepository, 'createProfile')
        .mockResolvedValue(profileMock)
      const createUserSpy = vi
        .spyOn(usersRepository, 'createUser')
        .mockResolvedValue(userMock)
      const triggerFetchingUserHistorySpy = vi.spyOn(
        historyScheduler,
        'triggerFetchingUserHistory'
      )

      expect(await authService.saveUser(accessTokenMock)).toEqual({
        accessToken,
        refreshToken,
        id: userMock.id,
      })
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneByProfileIdSpy).toHaveBeenCalledWith(profileMock.id)
      expect(createProfileSpy).toHaveBeenCalledWith(profileMock)
      expect(createUserSpy).toHaveBeenCalledWith({
        profile: profileMock,
        refreshToken,
      })
      expect(triggerFetchingUserHistorySpy).toHaveBeenCalledWith(
        userMock,
        count
      )
      expect(countSpy).toHaveBeenCalled()
    })

    test('should return existing user', async () => {
      const profileSpy = vi
        .spyOn(spotifyUsersService, 'profile')
        .mockResolvedValue(profileMock)
      const findOneByProfileIdSpy = vi
        .spyOn(usersRepository, 'findUserByProfileId')
        .mockResolvedValue(userMock)
      const createProfileSpy = vi.spyOn(profilesRepository, 'createProfile')

      const createUserSpy = vi.spyOn(usersRepository, 'createUser')

      expect(await authService.saveUser(accessTokenMock)).toEqual({
        accessToken,
        refreshToken,
        id: userMock.id,
      })
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneByProfileIdSpy).toHaveBeenCalledWith(profileMock.id)
      expect(createProfileSpy).not.toHaveBeenCalled()
      expect(createUserSpy).not.toHaveBeenCalled()
    })
  })
})
