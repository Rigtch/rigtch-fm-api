import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { formattedDevicesMock } from './../../../libs/common/src/spotify/mocks/formatted-device.mock'
import { PlayerResolver } from './player.resolver'
import { PlayerService } from './player.service'

describe('PlayerResolver', () => {
  let playerResolver: PlayerResolver
  let playerService: PlayerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerResolver,
        {
          provide: PlayerService,
          useValue: {
            avaibleDevices: jest.fn(),
            pausePlayer: jest.fn(),
          },
        },
      ],
    }).compile()

    playerResolver = module.get<PlayerResolver>(PlayerResolver)
    playerService = module.get<PlayerService>(PlayerService)
  })

  it('should be defined', () => {
    expect(playerResolver).toBeDefined()
  })

  it('should get available devices', async () => {
    playerService.avaibleDevices = jest
      .fn()
      .mockReturnValue(of(formattedDevicesMock))

    expect(await playerResolver.avaibleDevices('awd')).toEqual(
      formattedDevicesMock
    )
  })

  describe('pausePlayer', () => {
    it('should pause player', async () => {
      playerService.pausePlayer = jest
        .fn()
        .mockReturnValue(of({ success: true }))

      expect(await playerResolver.pausePlayer('awd')).toEqual({ success: true })
    })
  })
})
