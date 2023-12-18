import { Test, TestingModule } from '@nestjs/testing'

import { PlayerController } from './player.controller'
import { PlayerService } from './player.service'

import { devicesMock, playbackStateMock } from '@common/mocks'

describe('PlayerController', () => {
  let playerController: PlayerController
  let playerService: PlayerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerController,
        {
          provide: PlayerService,
          useValue: {
            availableDevices: vi.fn(),
            currentPlaybackState: vi.fn(),
            pausePlayer: vi.fn(),
            resumePlayer: vi.fn(),
          },
        },
      ],
    }).compile()

    playerController = module.get<PlayerController>(PlayerController)
    playerService = module.get<PlayerService>(PlayerService)
  })

  test('should be defined', () => {
    expect(playerController).toBeDefined()
  })

  test('should get available devices', async () => {
    vi.spyOn(playerService, 'availableDevices').mockResolvedValue(devicesMock)

    expect(await playerController.availableDevices('awd')).toEqual(devicesMock)
  })

  test('should get currentPlaybackState', async () => {
    vi.spyOn(playerService, 'currentPlaybackState').mockResolvedValue(
      playbackStateMock
    )

    expect(await playerController.currentPlaybackState('awd')).toEqual(
      playbackStateMock
    )
  })

  test('should pause player', async () => {
    vi.spyOn(playerService, 'pausePlayer').mockResolvedValue({ success: true })

    expect(await playerController.pausePlayer('awd')).toEqual({
      success: true,
    })
  })

  test('should resume player', async () => {
    vi.spyOn(playerService, 'resumePlayer').mockResolvedValue({ success: true })

    expect(await playerController.resumePlayer('awd')).toEqual({
      success: true,
    })
  })
})
