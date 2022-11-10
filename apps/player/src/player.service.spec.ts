import { HttpService } from '@nestjs/axios'
import { TestingModule, Test } from '@nestjs/testing'
import { of, firstValueFrom } from 'rxjs'

import { formattedDevicesMock } from './../../../libs/common/src/spotify/mocks/formatted-device.mock'
import { PlayerService } from './player.service'

import { spotifyDevicesMock, SpotifyService } from '@lib/common'

describe('PlayerService', () => {
  let playerService: PlayerService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        SpotifyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    playerService = module.get<PlayerService>(PlayerService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should be defined', () => {
    expect(playerService).toBeDefined()
  })

  it('should get available devices', async () => {
    httpService.get = jest.fn().mockReturnValue(
      of({
        data: {
          devices: spotifyDevicesMock,
        },
      })
    )

    expect(await firstValueFrom(playerService.avaibleDevices('awd'))).toEqual(
      formattedDevicesMock
    )
  })
})
