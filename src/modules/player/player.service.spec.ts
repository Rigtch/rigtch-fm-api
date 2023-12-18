import { HttpService } from '@nestjs/axios'
import { TestingModule, Test } from '@nestjs/testing'
import { of, throwError } from 'rxjs'
import { ForbiddenException } from '@nestjs/common'

import { PlayerService } from './player.service'

import {
  devicesMock,
  playbackStateMock,
  spotifyDevicesMock,
  spotifyPlaybackStateMock,
  axiosResponseMockFactory,
} from '@common/mocks'

const forbiddenExceptionObserver = throwError(() => ({
  data: {
    error: {
      status: 403,
    },
  },
}))

describe('PlayerService', () => {
  let playerService: PlayerService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,

        {
          provide: HttpService,
          useValue: {
            get: vi.fn(),
            put: vi.fn().mockReturnValue(of('')),
          },
        },
      ],
    }).compile()

    playerService = module.get<PlayerService>(PlayerService)
    httpService = module.get<HttpService>(HttpService)
  })

  test('should be defined', () => {
    expect(playerService).toBeDefined()
  })

  describe('availableDevices', () => {
    test('should get available devices', async () => {
      vi.spyOn(httpService, 'get').mockReturnValue(
        of(
          axiosResponseMockFactory({
            devices: spotifyDevicesMock,
          })
        )
      )

      expect(await playerService.availableDevices('awd')).toEqual(devicesMock)
    })

    test('should throw Forbidden expception because no device is currently playing', async () => {
      vi.spyOn(httpService, 'get').mockReturnValue(
        of(
          axiosResponseMockFactory({
            devices: [],
          })
        )
      )

      await expect(playerService.availableDevices('awd')).rejects.toThrowError(
        ForbiddenException
      )
    })
  })

  describe('currentPlaybackState', () => {
    test('should get playback state', async () => {
      vi.spyOn(httpService, 'get').mockReturnValue(
        of(axiosResponseMockFactory(spotifyPlaybackStateMock))
      )

      expect(await playerService.currentPlaybackState('awd')).toEqual(
        playbackStateMock
      )
    })

    test.skip('should throw Forbidden expception because No device is currently playing', async () => {
      vi.spyOn(httpService, 'get').mockReturnValue(
        of(axiosResponseMockFactory(forbiddenExceptionObserver))
      )

      await expect(
        playerService.currentPlaybackState('awd')
      ).rejects.toThrowError(ForbiddenException)
    })
  })

  describe('pausePlayer', () => {
    test('should pause player', async () => {
      expect(await playerService.pausePlayer('awd')).toEqual({
        success: true,
      })
    })

    test('should throw Forbidden expception because no device is currently playing', async () => {
      vi.spyOn(httpService, 'put').mockReturnValue(forbiddenExceptionObserver)

      await expect(playerService.pausePlayer('awd')).rejects.toThrowError(
        ForbiddenException
      )
    })
  })

  describe('resumePlayer', () => {
    test('should resume player', async () => {
      expect(await playerService.resumePlayer('awd')).toEqual({
        success: true,
      })
    })

    test('should throw Forbidden expception because no device is currently playing', async () => {
      vi.spyOn(httpService, 'put').mockReturnValue(forbiddenExceptionObserver)

      await expect(playerService.resumePlayer('awd')).rejects.toThrowError(
        ForbiddenException
      )
    })
  })
})
