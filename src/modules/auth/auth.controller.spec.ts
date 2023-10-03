import { test, describe, expect, beforeEach, vi } from 'vitest'
import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SecretData } from './dtos'

import { formattedProfileMock } from '@common/mocks'

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
    vi.spyOn(authService, 'profile').mockReturnValue(of(formattedProfileMock))

    expect(await firstValueFrom(authController.profile('123'))).toEqual(
      formattedProfileMock
    )
  })
})
