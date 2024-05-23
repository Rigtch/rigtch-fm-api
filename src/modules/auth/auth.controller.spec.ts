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
import { AdaptersService } from '@common/adapters'
import { SecretDataAdapter } from '@common/adapters'
import { SpotifyService } from '@modules/spotify'

describe('AuthController', () => {
  const redirectUrl = 'http://test.com'

  let moduleRef: TestingModule
  let authController: AuthController
  let spotifyService: SpotifyService
  let authService: AuthService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AdaptersService,
          useValue: {
            secretData: new SecretDataAdapter(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            auth: {
              token: vi.fn(),
              profile: vi.fn(),
            },
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

    authController = moduleRef.get(AuthController)
    spotifyService = moduleRef.get(SpotifyService)
    authService = moduleRef.get(AuthService)
  })

  afterEach(() => {
    moduleRef.close()
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
        .spyOn(spotifyService.auth, 'token')
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

    vi.spyOn(spotifyService.auth, 'token').mockResolvedValue(accessTokenMock)

    expect(await authController.refresh({ refreshToken })).toEqual(
      secretDataMock
    )
  })
})
