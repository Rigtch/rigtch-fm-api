import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { DeepMockProxy } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'
import { ConfigService } from '@nestjs/config'

import { CheckIsCurrentUserGuard } from './check-is-current-user.guard'

import { SpotifyService } from '@modules/spotify'
import { contextFactoryMock, profileMock, userMock } from '@common/mocks'
describe('CheckIsCurrentUserGuard', () => {
  let moduleRef: TestingModule
  let checkIsCurrentUserGuard: CheckIsCurrentUserGuard
  let spotifyService: SpotifyService
  let configService: ConfigService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        CheckIsCurrentUserGuard,
        {
          provide: SpotifyService,
          useValue: {
            auth: {
              getMeProfile: vi.fn(),
            },
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

    checkIsCurrentUserGuard = moduleRef.get(CheckIsCurrentUserGuard)
    spotifyService = moduleRef.get(SpotifyService)
    configService = moduleRef.get(ConfigService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(checkIsCurrentUserGuard).toBeDefined()
  })

  describe('canActivate', () => {
    const accessToken = 'access-token'
    let getMeProfileSpy: MockInstance

    let contextMock: DeepMockProxy<ExecutionContext>

    beforeEach(() => {
      getMeProfileSpy = vi.spyOn(spotifyService.auth, 'getMeProfile')
      contextMock = contextFactoryMock({
        user: userMock,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
    })

    test('should return true if user is public user', async () => {
      const getSpy = vi.spyOn(configService, 'get').mockReturnValue(userMock.id)

      expect(
        await checkIsCurrentUserGuard.canActivate(contextMock)
      ).toBeTruthy()

      expect(getSpy).toHaveBeenCalled()
    })

    test('should return true if user is current user', async () => {
      getMeProfileSpy.mockResolvedValue(profileMock)

      expect(
        await checkIsCurrentUserGuard.canActivate(contextMock)
      ).toBeTruthy()
    })

    test('should throw forbidden exception if user is not current user', async () => {
      getMeProfileSpy.mockResolvedValue({
        ...profileMock,
        id: 'another-id',
      })

      await expect(
        checkIsCurrentUserGuard.canActivate(contextMock)
      ).rejects.toThrowError(ForbiddenException)
    })
  })
})
