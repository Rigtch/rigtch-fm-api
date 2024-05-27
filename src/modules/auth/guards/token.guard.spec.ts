import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { DeepMockProxy } from 'vitest-mock-extended'
import { ExecutionContext } from '@nestjs/common'

import { TokenGuard } from './token.guard'

import { SpotifyService } from '@modules/spotify'
import { accessTokenMock, contextFactoryMock, userMock } from '@common/mocks'

describe('TokenGuard', () => {
  let moduleRef: TestingModule
  let tokenGuard: TokenGuard
  let spotifyService: SpotifyService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        TokenGuard,
        {
          provide: SpotifyService,
          useValue: {
            auth: {
              token: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    tokenGuard = moduleRef.get(TokenGuard)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tokenGuard).toBeDefined()
  })

  describe('canActivate', () => {
    let tokenSpy: MockInstance

    let contextMock: DeepMockProxy<ExecutionContext>

    beforeEach(() => {
      tokenSpy = vi.spyOn(spotifyService.auth, 'token')
      contextMock = contextFactoryMock({
        user: userMock,
      })
    })

    test('should return true', async () => {
      tokenSpy.mockResolvedValueOnce(accessTokenMock)

      expect(await tokenGuard.canActivate(contextMock)).toBeTruthy()

      expect(contextMock.switchToHttp().getRequest().token).toEqual(
        accessTokenMock
      )
    })
  })
})
