import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { PlayerController } from './player.controller'
import { PlayerService } from './player.service'

import { formattedDevicesMock, formattedPlaybackStateMock } from '@common/mocks'

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
            avaibleDevices: jest.fn(),
            currentPlaybackState: jest.fn(),
            pausePlayer: jest.fn(),
            resumePlayer: jest.fn(),
          },
        },
      ],
    }).compile()

    playerController = module.get<PlayerController>(PlayerController)
    playerService = module.get<PlayerService>(PlayerService)
  })

  it('should be defined', () => {
    expect(playerController).toBeDefined()
  })

  it('should get available devices', async () => {
    jest
      .spyOn(playerService, 'avaibleDevices')
      .mockReturnValue(of(formattedDevicesMock))

    expect(await playerController.availableDevices('awd')).toEqual(
      formattedDevicesMock
    )
  })

  it('should get currentPlaybackState', async () => {
    jest
      .spyOn(playerService, 'currentPlaybackState')
      .mockReturnValue(of(formattedPlaybackStateMock))

    expect(await playerController.currentPlaybackState('awd')).toEqual(
      formattedPlaybackStateMock
    )
  })

  it('should pause player', async () => {
    jest
      .spyOn(playerService, 'pausePlayer')
      .mockReturnValue(of({ success: true }))

    expect(await playerController.pausePlayer('awd')).toEqual({ success: true })
  })

  it('should resume player', async () => {
    jest
      .spyOn(playerService, 'resumePlayer')
      .mockReturnValue(of({ success: true }))

    expect(await playerController.resumePlayer('awd')).toEqual({
      success: true,
    })
  })
})
