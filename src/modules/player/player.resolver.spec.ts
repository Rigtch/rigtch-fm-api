import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { PlayerResolver } from './player.resolver'
import { PlayerService } from './player.service'

import { formattedPlaybackStateMock, formattedDevicesMock } from '@common/mocks'

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

  it('should get currentPlaybackState', async () => {
    playerService.currentPlaybackState = jest
      .fn()
      .mockReturnValue(of(formattedPlaybackStateMock))

    expect(await playerResolver.currentPlaybackState('awd')).toEqual(
      formattedPlaybackStateMock
    )
  })

  it('should pause player', async () => {
    playerService.pausePlayer = jest.fn().mockReturnValue(of({ success: true }))

    expect(await playerResolver.pausePlayer('awd')).toEqual({ success: true })
  })

  it('should resume player', async () => {
    playerService.resumePlayer = jest
      .fn()
      .mockReturnValue(of({ success: true }))

    expect(await playerResolver.resumePlayer('awd')).toEqual({ success: true })
  })
})
