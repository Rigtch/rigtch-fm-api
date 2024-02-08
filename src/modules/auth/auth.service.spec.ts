import { Test } from '@nestjs/testing'

import { AuthService } from './auth.service'

import { accessToken, refreshToken } from '@common/mocks'
import { profileMock, userMock, accessTokenMock } from '@common/mocks'
import { UsersRepository } from '@modules/users'
import { ProfilesRepository } from '@modules/profiles'
import { SpotifyUsersService } from '@modules/spotify/users'

describe('AuthService', () => {
  let authService: AuthService
  let usersRepository: UsersRepository
  let profilesRepository: ProfilesRepository
  let spotifyUsersService: SpotifyUsersService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findOneByProfileId: vi.fn(),
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
      ],
    }).compile()

    authService = module.get(AuthService)
    usersRepository = module.get(UsersRepository)
    profilesRepository = module.get(ProfilesRepository)
    spotifyUsersService = module.get(SpotifyUsersService)
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
        'findOneByProfileId'
      )
      const createProfileSpy = vi
        .spyOn(profilesRepository, 'createProfile')
        .mockResolvedValue(profileMock)
      const createUserSpy = vi
        .spyOn(usersRepository, 'createUser')
        .mockResolvedValue(userMock)

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
    })

    test('should return existing user', async () => {
      const profileSpy = vi
        .spyOn(spotifyUsersService, 'profile')
        .mockResolvedValue(profileMock)
      const findOneByProfileIdSpy = vi
        .spyOn(usersRepository, 'findOneByProfileId')
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
