import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { TokenResponse } from './dtos'

describe('AuthResolver', () => {
  let authResolver: AuthResolver
  let authService: AuthService

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
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    authResolver = module.get<AuthResolver>(AuthResolver)
  })

  it('should be defined', () => {
    expect(authResolver).toBeDefined()
  })

  it('should refresh', async () => {
    authService.token = jest.fn().mockReturnValueOnce(of(refreshResponse))

    expect(await authResolver.refresh(refreshToken)).toEqual({
      accessToken,
      refreshToken,
      expiresIn,
    })
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
