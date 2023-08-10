import { test, describe, expect, beforeEach, vi } from 'vitest'
import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SecretData } from './dtos'

import { FormattedProfile } from '@common/types/spotify'

describe('AuthController', () => {
  const redirectUrl = 'http://test.com'

  let authController: AuthController
  let authService: AuthService

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
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  test('should be defined', () => {
    expect(authController).toBeDefined()
  })

  test('login should return undefined', () => {
    const { url, statusCode } = authController.login()

    expect(url).toMatch(/authorize\?/)
    expect(statusCode).toEqual(HttpStatus.PERMANENT_REDIRECT)
  })

  test('callback should return valid redirect path', async () => {
    const tokenResponse = {
      accessToken: '123',
      refreshToken: '456',
      expiresIn: 3600,
    }

    vi.spyOn(authService, 'token').mockReturnValue(of(tokenResponse))

    const { accessToken, refreshToken } = tokenResponse

    expect(await authController.callback('code')).toEqual({
      url: `${redirectUrl}/api/authorize?${new URLSearchParams({
        accessToken,
        refreshToken,
      })}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
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
    const profileMock: FormattedProfile = {
      id: '123',
      displayName: 'test',
      email: 'email@test.com',
      images: [
        {
          url: 'http://test.com',
          height: 100,
          width: 100,
        },
      ],
      followers: 23,
      country: 'BR',
      href: 'http://test.com',
    }

    vi.spyOn(authService, 'profile').mockReturnValue(of(profileMock))

    expect(await firstValueFrom(authController.profile('123'))).toEqual(
      profileMock
    )
  })
})
