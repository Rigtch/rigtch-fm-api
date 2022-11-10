import { HttpService } from '@nestjs/axios'
import { TestingModule, Test } from '@nestjs/testing'
import { of, firstValueFrom } from 'rxjs'

import { PlayerService } from './player.service'

import {
  formattedDevicesMock,
  spotifyDevicesMock,
  SpotifyService,
} from '@lib/common'

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
            put: jest.fn().mockReturnValue(of('')),
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

  describe('pausePlayer', () => {
    it('should pause player', async () => {
      httpService.get = jest.fn().mockReturnValue(
        of({
          data: {
            devices: spotifyDevicesMock,
          },
        })
      )

      expect(
        await firstValueFrom(
          await firstValueFrom(playerService.pausePlayer('awd'))
        )
      ).toEqual({
        success: true,
      })
    })
  })
})
