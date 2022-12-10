import { createMock } from '@golevelup/ts-jest'
import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SpotifyAuthRequest } from './types'

describe('AuthController', () => {
  const redirectUrl = 'http://test.com'
  const tokenResponse = {
    accessToken: '123',
    refreshToken: '456',
    expiresIn: 3600,
  }

  let authController: AuthController
  let request: SpotifyAuthRequest

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: {
            token: jest.fn().mockReturnValue(of(tokenResponse)),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(redirectUrl),
          },
        },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    request = createMock<SpotifyAuthRequest>({
      query: {
        code: '123',
      },
    })
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  it('login should return undefined', () => {
    const { url, statusCode } = authController.login()

    expect(url).toMatch(/authorize\?/)
    expect(statusCode).toEqual(HttpStatus.PERMANENT_REDIRECT)
  })

  it('callback should return valid redirect path', async () => {
    expect(await authController.callback(request)).toEqual({
      url: `${redirectUrl}/about?accessToken=${tokenResponse.accessToken}&refreshToken=${tokenResponse.refreshToken}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    })
  })
})
