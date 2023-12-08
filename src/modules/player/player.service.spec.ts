import { test, describe, expect, beforeEach, vi } from 'vitest'
import { HttpService } from '@nestjs/axios'
import { TestingModule, Test } from '@nestjs/testing'
import { of, firstValueFrom, throwError, catchError } from 'rxjs'
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
  response: {
    data: {
      error: {
        status: 403,
      },
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

      expect(
        await firstValueFrom(playerService.availableDevices('awd'))
      ).toEqual(devicesMock)
    })

    test('should throw Forbidden expception because no device is currently playing', async () => {
      vi.spyOn(httpService, 'get').mockReturnValue(
        of(
          axiosResponseMockFactory({
            devices: [],
          })
        )
      )

      expect(
        await firstValueFrom(
          playerService
            .availableDevices('awd')
            .pipe(catchError(error => [error]))
        )
      ).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('currentPlaybackState', () => {
    test('should get playback state', async () => {
      vi.spyOn(httpService, 'get').mockReturnValue(
        of(axiosResponseMockFactory(spotifyPlaybackStateMock))
      )

      expect(
        await firstValueFrom(playerService.currentPlaybackState('awd'))
      ).toEqual(playbackStateMock)
    })

    test('should throw Forbidden expception because No device is currently playing', async () => {
      vi.spyOn(httpService, 'get').mockReturnValue(
        of(axiosResponseMockFactory(''))
      )

      expect(
        await firstValueFrom(
          playerService
            .currentPlaybackState('awd')
            .pipe(catchError(error => [error]))
        )
      ).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('pausePlayer', () => {
    test('should pause player', async () => {
      expect(await firstValueFrom(playerService.pausePlayer('awd'))).toEqual({
        success: true,
      })
    })

    test('should throw Forbidden expception because no device is currently playing', async () => {
      vi.spyOn(httpService, 'put').mockReturnValue(forbiddenExceptionObserver)

      expect(
        await firstValueFrom(
          playerService.pausePlayer('awd').pipe(catchError(error => [error]))
        )
      ).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('resumePlayer', () => {
    test('should resume player', async () => {
      expect(await firstValueFrom(playerService.resumePlayer('awd'))).toEqual({
        success: true,
      })
    })

    test('should throw Forbidden expception because no device is currently playing', async () => {
      vi.spyOn(httpService, 'put').mockReturnValue(forbiddenExceptionObserver)

      expect(
        await firstValueFrom(
          playerService.resumePlayer('awd').pipe(catchError(error => [error]))
        )
      ).toBeInstanceOf(ForbiddenException)
    })
  })
})
