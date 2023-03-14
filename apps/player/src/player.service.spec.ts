import { HttpService } from '@nestjs/axios'
import { TestingModule, Test } from '@nestjs/testing'
import { of, firstValueFrom, throwError, catchError } from 'rxjs'
import { ForbiddenException } from '@nestjs/common'

import { PlayerService } from './player.service'

import {
  formattedDevicesMock,
  formattedPlaybackStateMock,
  spotifyDevicesMock,
  spotifyPlaybackStateMock,
  SpotifyService,
} from '@lib/common'

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

  describe('currentPlaybackState', () => {
    it('should get playback state', async () => {
      httpService.get = jest.fn().mockReturnValue(
        of({
          data: spotifyPlaybackStateMock,
        })
      )

      expect(
        await firstValueFrom(playerService.currentPlaybackState('awd'))
      ).toEqual(formattedPlaybackStateMock)
    })

    it('should throw Forbidden expception because No device is currently playing', async () => {
      httpService.get = jest.fn().mockReturnValue(
        of({
          data: '',
        })
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
    it('should pause player', async () => {
      expect(await firstValueFrom(playerService.pausePlayer('awd'))).toEqual({
        success: true,
      })
    })

    it('should throw Forbidden expception because No device is currently playing', async () => {
      httpService.put = jest.fn().mockReturnValue(forbiddenExceptionObserver)

      expect(
        await firstValueFrom(
          playerService.pausePlayer('awd').pipe(catchError(error => [error]))
        )
      ).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('resumePlayer', () => {
    it('should resume player', async () => {
      expect(await firstValueFrom(playerService.resumePlayer('awd'))).toEqual({
        success: true,
      })
    })

    it('should throw Forbidden expception because No device is currently playing', async () => {
      httpService.put = jest.fn().mockReturnValue(forbiddenExceptionObserver)

      expect(
        await firstValueFrom(
          playerService.resumePlayer('awd').pipe(catchError(error => [error]))
        )
      ).toBeInstanceOf(ForbiddenException)
    })
  })
})
