import { HttpService, HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { spotifyTokenMock } from './mocks'
import { SpotifyAuthService } from './spotify-auth.service'

import { EnvService } from '@config/env'
import {
  axiosResponseMockFactory,
  profileMock,
  sdkProfileMock,
} from '@common/mocks'
import { SdkProfile } from '@common/types/spotify'
import { AdaptersService, ProfileAdapter } from '@common/adapters'

describe('SpotifyAuthService', () => {
  let moduleRef: TestingModule
  let spotifyAuthService: SpotifyAuthService
  let httpService: HttpService
  let envService: EnvService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SpotifyAuthService,
        {
          provide: AdaptersService,
          useValue: {
            profile: new ProfileAdapter(),
          },
        },
        {
          provide: EnvService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    spotifyAuthService = moduleRef.get(SpotifyAuthService)
    httpService = moduleRef.get(HttpService)
    envService = moduleRef.get(EnvService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(spotifyAuthService).toBeDefined()
  })

  describe('token', () => {
    test('should generate token object using refreshToken method', async () => {
      const refreshToken = 'refreshToken'
      const clientId = 'clientId'

      spotifyTokenMock.refresh_token = undefined

      const getSpy = vi.spyOn(envService, 'get').mockReturnValue(clientId)
      const postSpy = vi
        .spyOn(httpService, 'post')
        .mockReturnValue(of(axiosResponseMockFactory(spotifyTokenMock)))

      expect(await spotifyAuthService.token({ refreshToken })).toEqual(
        spotifyTokenMock
      )
      expect(getSpy).toHaveBeenCalledTimes(3)
      expect(postSpy).toHaveBeenCalled()
    })
  })

  test('should get me profile', async () => {
    const getSpy = vi
      .spyOn(httpService, 'get')
      .mockReturnValue(of(axiosResponseMockFactory<SdkProfile>(sdkProfileMock)))

    expect(await spotifyAuthService.getMeProfile('token')).toEqual(profileMock)
    expect(getSpy).toHaveBeenCalled()
  })
})
