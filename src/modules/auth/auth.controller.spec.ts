import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { AuthController } from './auth.controller'
import { SecretData } from './dtos'

import {
  accessToken,
  accessTokenMock,
  profileMock,
  refreshToken,
  userMock,
} from '@common/mocks'
import { ProfilesService } from '@modules/profiles'
import { UsersRepository } from '@modules/users'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyUsersService } from '@modules/spotify/users'

describe('AuthController', () => {
  const redirectUrl = 'http://test.com'

  let authController: AuthController
  let spotifyAuthService: SpotifyAuthService
  let spotifyUsersService: SpotifyUsersService
  let profilesService: ProfilesService
  let usersRepository: UsersRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: SpotifyAuthService,
          useValue: {
            token: vi.fn(),
            profile: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue(redirectUrl),
          },
        },
        {
          provide: ProfilesService,
          useValue: {
            create: vi.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            createUser: vi.fn(),
            findOneByProfileId: vi.fn(),
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

    authController = module.get(AuthController)
    spotifyAuthService = module.get(SpotifyAuthService)
    profilesService = module.get(ProfilesService)
    usersRepository = module.get(UsersRepository)
    spotifyUsersService = module.get(SpotifyUsersService)
  })

  test('should be defined', () => {
    expect(authController).toBeDefined()
  })

  test('login should return undefined', () => {
    const { url, statusCode } = authController.login()

    expect(url).toMatch(/authorize\?/)
    expect(statusCode).toEqual(HttpStatus.PERMANENT_REDIRECT)
  })

  describe('callback', () => {
    const code = 'code'

    test('callback should return valid redirect path', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const profileSpy = vi
        .spyOn(spotifyUsersService, 'profile')
        .mockResolvedValue(profileMock)
      const findOneByProfileIdSpy = vi
        .spyOn(usersRepository, 'findOneByProfileId')
        .mockResolvedValue(userMock)

      expect(await authController.callback(code)).toEqual({
        url: `${redirectUrl}/api/authorize?${new URLSearchParams({
          accessToken,
          refreshToken,
          id: userMock.id,
        }).toString()}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      })
      expect(tokenSpy).toHaveBeenCalledWith({ code })
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneByProfileIdSpy).toHaveBeenCalledWith(profileMock.id)
    })

    test('should find profile by id', async () => {
      vi.spyOn(spotifyAuthService, 'token').mockResolvedValue(accessTokenMock)
      vi.spyOn(spotifyUsersService, 'profile').mockResolvedValue(profileMock)

      const findUserByProfileId = vi
        .spyOn(usersRepository, 'findOneByProfileId')
        .mockResolvedValue(userMock)
      const createSpy = vi.spyOn(profilesService, 'create')
      const createUserSpy = vi.spyOn(usersRepository, 'createUser')

      expect(await authController.callback(code)).toEqual({
        url: `${redirectUrl}/api/authorize?${new URLSearchParams({
          accessToken,
          refreshToken,
          id: userMock.id,
        }).toString()}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      })
      expect(findUserByProfileId).toHaveBeenCalledWith(profileMock.id)
      expect(createSpy).not.toHaveBeenCalled()
      expect(createUserSpy).not.toHaveBeenCalled()
    })

    test('should create profile and user', async () => {
      vi.spyOn(spotifyAuthService, 'token').mockResolvedValue(accessTokenMock)
      vi.spyOn(spotifyUsersService, 'profile').mockResolvedValue(profileMock)

      const findUserByProfileId = vi.spyOn(
        usersRepository,
        'findOneByProfileId'
      )
      const createSpy = vi
        .spyOn(profilesService, 'create')
        .mockResolvedValue(profileMock)
      const createUserSpy = vi
        .spyOn(usersRepository, 'createUser')
        .mockResolvedValue(userMock)

      expect(await authController.callback(code)).toEqual({
        url: `${redirectUrl}/api/authorize?${new URLSearchParams({
          accessToken,
          refreshToken,
          id: userMock.id,
        }).toString()}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      })
      expect(findUserByProfileId).toHaveBeenCalledWith(profileMock.id)
      expect(createSpy).toHaveBeenCalledWith(profileMock)
      expect(createUserSpy).toHaveBeenCalledWith({
        profile: profileMock,
        refreshToken,
      })
    })
  })

  test('should refresh token', async () => {
    const secretDataMock: SecretData = {
      accessToken,
      refreshToken,
      expiresIn: accessTokenMock.expires_in,
    }

    vi.spyOn(spotifyAuthService, 'token').mockResolvedValue(accessTokenMock)

    expect(await authController.refresh(refreshToken)).toEqual(secretDataMock)
  })
})
