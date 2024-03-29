import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { AuthController } from './auth.controller'
import { SecretData } from './dtos'
import { AuthService } from './auth.service'
import { AuthorizeParams } from './types'

import {
  accessToken,
  accessTokenMock,
  refreshToken,
  userMock,
} from '@common/mocks'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { AdaptersService } from '@common/adapters'
import { SecretDataAdapter } from '@common/adapters'

describe('AuthController', () => {
  const redirectUrl = 'http://test.com'

  let authController: AuthController
  let spotifyAuthService: SpotifyAuthService
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AdaptersService,
          useValue: {
            secretData: new SecretDataAdapter(),
          },
        },
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
          provide: AuthService,
          useValue: {
            saveUser: vi.fn(),
          },
        },
      ],
    }).compile()

    authController = module.get(AuthController)
    spotifyAuthService = module.get(SpotifyAuthService)
    authService = module.get(AuthService)
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
    const authorizeParams: AuthorizeParams = {
      accessToken,
      refreshToken,
      id: userMock.id,
    }

    test('callback should return valid redirect path', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const saveUserSpy = vi
        .spyOn(authService, 'saveUser')
        .mockResolvedValue(authorizeParams)

      expect(await authController.callback(code)).toEqual({
        url: `${redirectUrl}/api/authorize?${new URLSearchParams({
          ...authorizeParams,
        }).toString()}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      })
      expect(tokenSpy).toHaveBeenCalledWith({ code })
      expect(saveUserSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })

  test('should refresh token', async () => {
    const secretDataMock: SecretData = {
      accessToken,
      refreshToken,
      expiresIn: accessTokenMock.expires_in,
    }

    vi.spyOn(spotifyAuthService, 'token').mockResolvedValue(accessTokenMock)

    expect(await authController.refresh({ refreshToken })).toEqual(
      secretDataMock
    )
  })
})
