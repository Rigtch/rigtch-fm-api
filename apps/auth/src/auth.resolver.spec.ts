import { createMock } from '@golevelup/ts-jest'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { Response } from 'express'
import { of } from 'rxjs'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { TokenResponse } from './types'

describe('AuthResolver', () => {
  let authResolver: AuthResolver
  let authService: AuthService
  let response: Response

  const refreshToken = '123'
  const accessToken = '456'
  const expiresIn = 3600

  const refreshResponse: TokenResponse = {
    accessToken,
    expiresIn,
    refreshToken,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            refresh: jest.fn(),
            profile: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    authResolver = module.get<AuthResolver>(AuthResolver)
    response = createMock<Response>()
  })

  it('should be defined', () => {
    expect(authResolver).toBeDefined()
  })

  it('should refresh', async () => {
    authService.token = jest.fn().mockReturnValueOnce(of(refreshResponse))

    expect(await authResolver.refresh(refreshToken, { res: response })).toEqual(
      true
    )

    expect(response.cookie).toHaveBeenCalledWith('access-token', accessToken, {
      secure: false,
      httpOnly: true,
    })
  })

  it('should logout', async () => {
    expect(await authResolver.logout({ res: response })).toEqual(true)

    expect(response.clearCookie).toHaveBeenCalledTimes(2)
  })

  it('should get profile', async () => {
    authService.profile = jest.fn().mockReturnValueOnce(of(refreshResponse))

    expect(await authResolver.profile(refreshToken)).toEqual({
      accessToken,
      refreshToken,
      expiresIn,
    })
  })
})
