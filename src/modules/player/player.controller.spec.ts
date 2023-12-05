import { test, describe, expect, beforeEach, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

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
    vi.spyOn(playerService, 'availableDevices').mockReturnValue(of(devicesMock))

    expect(
      await firstValueFrom(playerController.availableDevices('awd'))
    ).toEqual(devicesMock)
  })

  test('should get currentPlaybackState', async () => {
    vi.spyOn(playerService, 'currentPlaybackState').mockReturnValue(
      of(playbackStateMock)
    )

    expect(
      await firstValueFrom(playerController.currentPlaybackState('awd'))
    ).toEqual(playbackStateMock)
  })

  test('should pause player', async () => {
    vi.spyOn(playerService, 'pausePlayer').mockReturnValue(
      of({ success: true })
    )

    expect(await firstValueFrom(playerController.pausePlayer('awd'))).toEqual({
      success: true,
    })
  })

  test('should resume player', async () => {
    vi.spyOn(playerService, 'resumePlayer').mockReturnValue(
      of({ success: true })
    )

    expect(await firstValueFrom(playerController.resumePlayer('awd'))).toEqual({
      success: true,
    })
  })
})
