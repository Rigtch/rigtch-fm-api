import { HttpService, HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { of } from 'rxjs'

import { spotifyTokenMock } from './mocks'
import { SpotifyAuthService } from './spotify-auth.service'
import { SpotifyToken } from './types/spotify'

import {
  axiosResponseMockFactory,
  profileMock,
  spotifyProfileMock,
} from '@common/mocks'
import { SpotifyProfile } from '@common/types/spotify'

describe('SpotifyAuthService', () => {
  let spotifyAuthService: SpotifyAuthService
  let httpService: HttpService
  let configService: ConfigService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SpotifyAuthService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    spotifyAuthService = module.get(SpotifyAuthService)
    httpService = module.get(HttpService)
    configService = module.get(ConfigService)
  })

  test('should be defined', () => {
    expect(spotifyAuthService).toBeDefined()
  })

  describe('token', () => {
    test('should generate token object using code method', async () => {
      const code = 'code'
      const clientId = 'clientId'

      const getSpy = vi.spyOn(configService, 'get').mockReturnValue(clientId)
      const postSpy = vi
        .spyOn(httpService, 'post')
        .mockReturnValue(
          of(axiosResponseMockFactory<SpotifyToken>(spotifyTokenMock))
        )

      expect(await spotifyAuthService.token({ code })).toEqual(spotifyTokenMock)
      expect(getSpy).toHaveBeenCalledTimes(4)
      expect(postSpy).toHaveBeenCalled()
    })

    test('should generate token object using refreshToken method', async () => {
      const refreshToken = 'refreshToken'
      const clientId = 'clientId'

      spotifyTokenMock.refresh_token = undefined

      const getSpy = vi.spyOn(configService, 'get').mockReturnValue(clientId)
      const postSpy = vi
        .spyOn(httpService, 'post')
        .mockReturnValue(of(axiosResponseMockFactory(spotifyTokenMock)))

      expect(await spotifyAuthService.token({ refreshToken })).toEqual(
        spotifyTokenMock
      )
      expect(getSpy).toHaveBeenCalledTimes(4)
      expect(postSpy).toHaveBeenCalled()
    })
  })

  test('should get me profile', async () => {
    const getSpy = vi
      .spyOn(httpService, 'get')
      .mockReturnValue(
        of(axiosResponseMockFactory<SpotifyProfile>(spotifyProfileMock))
      )

    expect(await spotifyAuthService.getMeProfile('token')).toEqual(profileMock)
    expect(getSpy).toHaveBeenCalled()
  })
})
