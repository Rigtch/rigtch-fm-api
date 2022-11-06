import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { RefreshResponse } from './dtos'

describe('AuthResolver', () => {
  let authResolver: AuthResolver
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            refresh: jest.fn(),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    authResolver = module.get<AuthResolver>(AuthResolver)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('should refresh', async () => {
    const refreshToken = '123'
    const accessToken = '456'
    const expiresIn = 3600

    const refreshResponse: RefreshResponse = {
      accessToken,
      expiresIn,
      refreshToken,
    }

    authService.refresh = jest.fn().mockReturnValueOnce(of(refreshResponse))

    expect(await authResolver.refresh(refreshToken)).toEqual({
      accessToken,
      refreshToken,
      expiresIn,
    })
  })
})
