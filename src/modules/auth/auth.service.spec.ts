import { Test, TestingModule } from '@nestjs/testing'

import { AuthService } from './auth.service'

import { accessToken, refreshToken } from '@common/mocks'
import { profileMock, userMock, accessTokenMock } from '@common/mocks'
import { UsersRepository } from '@modules/users'
import { ProfilesRepository } from '@modules/profiles'
import { SpotifyUsersService } from '@modules/spotify/users'
import { HistoryScheduler } from '@modules/history'

describe('AuthService', () => {
  let moduleRef: TestingModule
  let authService: AuthService
  let usersRepository: UsersRepository
  let profilesRepository: ProfilesRepository
  let spotifyUsersService: SpotifyUsersService
  let historyScheduler: HistoryScheduler

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findUserByProfileId: vi.fn(),
            createUser: vi.fn(),
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

    authService = moduleRef.get(AuthService)
    usersRepository = moduleRef.get(UsersRepository)
    profilesRepository = moduleRef.get(ProfilesRepository)
    spotifyUsersService = moduleRef.get(SpotifyUsersService)
    historyScheduler = moduleRef.get(HistoryScheduler)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('saveUser', () => {
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
      expect(triggerFetchingUserHistorySpy).toHaveBeenCalledWith(userMock)
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
