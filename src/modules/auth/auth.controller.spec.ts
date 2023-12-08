import { test, describe, expect, beforeEach, vi } from 'vitest'
import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SecretData } from './dtos'

import { profileMock, userMock } from '@common/mocks'
import { ProfilesService } from '@modules/profiles'
import { UsersRepository } from '@modules/users'

describe('AuthController', () => {
  const redirectUrl = 'http://test.com'

  let authController: AuthController
  let authService: AuthService

  let profilesService: ProfilesService
  let usersRepository: UsersRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
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
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
    profilesService = module.get<ProfilesService>(ProfilesService)
    usersRepository = module.get<UsersRepository>(UsersRepository)
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
    const tokenResponse = {
      accessToken: '123',
      refreshToken: '456',
      expiresIn: 3600,
    }
    const { accessToken, refreshToken } = tokenResponse

    test('callback should return valid redirect path', async () => {
      const tokenSpy = vi
        .spyOn(authService, 'token')
        .mockReturnValue(of(tokenResponse))
      const profileSpy = vi
        .spyOn(authService, 'profile')
        .mockReturnValue(of(profileMock))

      expect(await authController.callback(code)).toEqual({
        url: `${redirectUrl}/api/authorize?${new URLSearchParams({
          accessToken,
          refreshToken,
        })}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      })
      expect(tokenSpy).toHaveBeenCalledWith({ code })
      expect(profileSpy).toHaveBeenCalledWith(accessToken)
    })

    test('should find profile by id', async () => {
      vi.spyOn(authService, 'token').mockReturnValue(of(tokenResponse))
      vi.spyOn(authService, 'profile').mockReturnValue(of(profileMock))

      const findUserByProfileId = vi
        .spyOn(usersRepository, 'findOneByProfileId')
        .mockResolvedValue(userMock)
      const createSpy = vi.spyOn(profilesService, 'create')
      const createUserSpy = vi.spyOn(usersRepository, 'createUser')

      expect(await authController.callback(code)).toEqual({
        url: `${redirectUrl}/api/authorize?${new URLSearchParams({
          accessToken,
          refreshToken,
        })}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      })

      expect(findUserByProfileId).toHaveBeenCalledWith(profileMock.id)
      expect(createSpy).not.toHaveBeenCalled()
      expect(createUserSpy).not.toHaveBeenCalled()
    })

    test('should create profile and user', async () => {
      vi.spyOn(authService, 'token').mockReturnValue(of(tokenResponse))
      vi.spyOn(authService, 'profile').mockReturnValue(of(profileMock))

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
        })}`,
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
    const secretData: SecretData = {
      accessToken: '123',
      expiresIn: 3600,
    }

    vi.spyOn(authService, 'token').mockReturnValue(of(secretData))

    expect(await firstValueFrom(authController.refresh('123'))).toEqual(
      secretData
    )
  })

  test('should return profile', async () => {
    vi.spyOn(authService, 'profile').mockReturnValue(of(profileMock))

    expect(await firstValueFrom(authController.profile('123'))).toEqual(
      profileMock
    )
  })
})
