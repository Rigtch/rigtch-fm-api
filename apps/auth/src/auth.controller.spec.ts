import { createMock } from '@golevelup/ts-jest'
import { ForbiddenException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { Response } from 'express'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SpotifyAuthRequest } from './types'

describe('AuthController', () => {
  const clientUrl = 'http://test.com'
  const jwt = 'test'

  let authController: AuthController
  let request: SpotifyAuthRequest
  let response: Response

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockReturnValue(jwt),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(clientUrl),
          },
        },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    request = createMock<SpotifyAuthRequest>({
      authInfo: {
        accessToken: '123',
        refreshToken: '456',
        expiresIn: 3600,
      },
    })
    response = createMock<Response>()
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  it('login should return undefined', () => {
    expect(authController.login()).toBeUndefined()
  })

  describe('callback', () => {
    it('should return valid redirect path', async () => {
      expect(await authController.callback(request, response)).toEqual({
        url: `${clientUrl}/about?accessToken=123&refreshToken=456`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      })
      expect(response.set).toHaveBeenCalledWith(
        'Authorization',
        `Bearer ${jwt}`
      )
    })

    it('should throw forbidden exception because of no user', async () => {
      request.user = undefined

      expect(authController.callback(request, response)).rejects.toThrow(
        ForbiddenException
      )
    })
  })
})
