import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { Profile } from 'passport-spotify'
import { firstValueFrom, of } from 'rxjs'

import { AuthService } from './auth.service'

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
            sign: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
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
    jwtService = module.get<JwtService>(JwtService)
    httpService = module.get<HttpService>(HttpService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('should login', () => {
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

    jwtService.sign = jest.fn().mockReturnValue('token')

    expect(authService.login(profile)).toEqual('token')
  })

  it('should refresh', async () => {
    configService.get = jest.fn().mockReturnValue('value')

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

    httpService.post = jest.fn().mockReturnValue(of(response))

    expect(await firstValueFrom(authService.refresh('refresh'))).toEqual(
      expectedResponse
    )
  })
})
