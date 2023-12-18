import { URLSearchParams } from 'node:url'

import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { Profile } from 'passport-spotify'
import { of } from 'rxjs'

import { AuthService } from './auth.service'

import { spotifyProfileMock, profileMock } from '@common/mocks'

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService
  let httpService: HttpService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: JwtService,
          useValue: {
            sign: vi.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: vi.fn(),
            get: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
    httpService = module.get<HttpService>(HttpService)
    configService = module.get<ConfigService>(ConfigService)
  })

  test('should be defined', () => {
    expect(authService).toBeDefined()
  })

  test('should login', () => {
    const profile: Profile = {
      provider: 'spotify',
      id: '123',
      displayName: 'John Doe',
      username: 'john.doe',
      photos: ['example'],
      profileUrl: 'example.com',
      country: 'US',
      followers: 0,
      product: 'premium',
      _raw: 'raw',
      _json: {},
    }

    jwtService.sign = vi.fn().mockReturnValue('token')

    expect(authService.login(profile)).toBe('token')
  })

  describe('token', () => {
    test('should refresh token', async () => {
      configService.get = vi.fn().mockReturnValue('value')

      const response = {
        data: {
          access_token: 'token',
          expires_in: 3600,
        },
      }

      const expectedResponse = {
        accessToken: 'token',
        expiresIn: 3600,
      }

      httpService.post = vi
        .fn()
        .mockImplementation((_url, parameters: URLSearchParams) => {
          if (parameters.get('grant_type') === 'refresh_token')
            return of(response)
        })

      expect(await authService.token({ refreshToken: 'refresh' })).toEqual(
        expectedResponse
      )
    })

    test('should authorize and get tokens', async () => {
      configService.get = vi.fn().mockReturnValue('value')

      const response = {
        data: {
          access_token: 'token',
          refresh_token: 'refresh',
          expires_in: 3600,
        },
      }

      const expectedResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresIn: 3600,
      }

      httpService.post = vi
        .fn()
        .mockImplementation((_url, parameters: URLSearchParams) => {
          if (parameters.get('grant_type') === 'authorization_code')
            return of(response)
        })

      expect(await authService.token({ code: 'code' })).toEqual(
        expectedResponse
      )
    })
  })

  test('should return profile', async () => {
    const response = {
      data: spotifyProfileMock,
    }

    httpService.get = vi.fn().mockReturnValue(of(response))

    expect(await authService.profile('token')).toEqual(profileMock)
  })
})
