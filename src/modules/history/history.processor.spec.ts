import { Test, TestingModule } from '@nestjs/testing'
import { Job } from 'bullmq'
import { AccessToken, MaxInt, PlayHistory } from '@spotify/web-api-ts-sdk'
import { MockInstance } from 'vitest'
import { DeepMockProxy, MockProxy, mock, mockDeep } from 'vitest-mock-extended'

import { HistoryProcessor } from './history.processor'
import {
  HistoryTrack,
  HistoryTracksRepository,
  HistoryTracksService,
} from './tracks'

import { SpotifyService } from '@modules/spotify'
import { accessTokenMock, trackEntityMock, userMock } from '@common/mocks'
import { SdkRecentlyPlayedTracksPage } from '@common/types/spotify'
import { QueryRange } from '@modules/spotify/player/types'
import { User } from '@modules/users'

type GetRecentlyPlayedMockInstance = MockInstance<
  [
    token: AccessToken,
    limit: MaxInt<50>,
    queryRange?: QueryRange,
    adapt?: false,
  ],
  Promise<SdkRecentlyPlayedTracksPage>
>

describe('HistoryProcessor', () => {
  let moduleRef: TestingModule
  let historyProcessor: HistoryProcessor
  let historyTracksRepository: HistoryTracksRepository
  let historyTracksService: HistoryTracksService
  let spotifyService: SpotifyService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        HistoryProcessor,
        {
          provide: HistoryTracksRepository,
          useValue: {
            findLastHistoryTrackByUser: vi.fn(),
          },
        },
        {
          provide: HistoryTracksService,
          useValue: {
            create: vi.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            auth: { token: vi.fn() },
            player: {
              getRecentlyPlayedTracks: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    historyProcessor = moduleRef.get(HistoryProcessor)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    historyTracksService = moduleRef.get(HistoryTracksService)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyProcessor).toBeDefined()
  })

  describe('synchronize', () => {
    let findLastHistoryTrackByUserSpy: MockInstance
    let createSpy: MockInstance
    let tokenSpy: MockInstance
    let getRecentlyPlayedTracksSpy: GetRecentlyPlayedMockInstance

    let playHistoryMock: MockProxy<PlayHistory[]>
    let jobMock: DeepMockProxy<Job<User>>

    beforeEach(() => {
      playHistoryMock = mock<PlayHistory[]>()

      findLastHistoryTrackByUserSpy = vi.spyOn(
        historyTracksRepository,
        'findLastHistoryTrackByUser'
      )
      createSpy = vi.spyOn(historyTracksService, 'create')
      tokenSpy = vi.spyOn(spotifyService.auth, 'token')
      getRecentlyPlayedTracksSpy = vi.spyOn(
        spotifyService.player,
        'getRecentlyPlayedTracks'
      ) as unknown as GetRecentlyPlayedMockInstance

      jobMock = mockDeep<Job<User>>({
        data: userMock,
      })
    })

    test('should create new history tracks', async () => {
      tokenSpy.mockResolvedValue(accessTokenMock)
      getRecentlyPlayedTracksSpy.mockResolvedValue(
        mockDeep<SdkRecentlyPlayedTracksPage>({
          items: playHistoryMock,
        })
      )

      findLastHistoryTrackByUserSpy.mockResolvedValue(null)

      await historyProcessor.process(jobMock)

      expect(createSpy).toHaveBeenCalledWith(playHistoryMock, userMock)
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(createSpy).toHaveBeenCalledWith(playHistoryMock, userMock)
    })

    test('should create only new history tracks', async () => {
      const externalId = 'externalId'
      const playedAt = new Date()

      const lastHistoryTrack = mock<HistoryTrack>({
        track: { ...trackEntityMock, externalId },
        playedAt,
      })

      const playHistory = [
        mock<PlayHistory>(),
        mock<PlayHistory>({
          track: { id: externalId },
          played_at: playedAt.toISOString(),
        }),
      ]

      findLastHistoryTrackByUserSpy.mockResolvedValue(lastHistoryTrack)
      tokenSpy.mockResolvedValue(accessTokenMock)
      getRecentlyPlayedTracksSpy.mockResolvedValue(
        mockDeep<SdkRecentlyPlayedTracksPage>({
          items: playHistory,
        })
      )

      await historyProcessor.process(jobMock)

      expect(createSpy).toHaveBeenCalledWith([playHistory[0]], userMock)
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalled()
    })

    test('should not create history tracks if latest play history is empty', async () => {
      const externalId = 'externalId'
      const playedAt = new Date()

      const lastHistoryTrack = {
        track: { ...trackEntityMock, externalId },
        playedAt,
      }

      const playHistory = Array.from({ length: 3 }).map(() => ({
        track: { id: externalId },
        played_at: playedAt.toISOString(),
      }))

      findLastHistoryTrackByUserSpy.mockResolvedValue(lastHistoryTrack)
      tokenSpy.mockResolvedValue(accessTokenMock)
      getRecentlyPlayedTracksSpy.mockResolvedValue({
        items: playHistory,
      } as SdkRecentlyPlayedTracksPage)

      await historyProcessor.process(jobMock)

      expect(createSpy).not.toHaveBeenCalled()
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalled()
    })

    test('should not create history tracks if refresh token is revoked', async () => {
      const errorMock = {
        error_description: 'Refresh token revoked',
      }

      tokenSpy.mockRejectedValue(errorMock)

      await historyProcessor.process(jobMock)

      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getRecentlyPlayedTracksSpy).not.toHaveBeenCalled()
      expect(createSpy).not.toHaveBeenCalled()
    })

    test('should throw error', async () => {
      const errorMock = new Error('error')

      tokenSpy.mockRejectedValue(errorMock)

      await expect(historyProcessor.process(jobMock)).rejects.toThrowError(
        errorMock
      )

      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getRecentlyPlayedTracksSpy).not.toHaveBeenCalled()
      expect(createSpy).not.toHaveBeenCalled()
    })
  })

  describe('EventListeners', () => {
    let logSpy: MockInstance
    let errorSpy: MockInstance

    let errorMock: Error
    let jobMock: DeepMockProxy<Job<User>>

    beforeEach(() => {
      // @ts-expect-error - mocking private property
      logSpy = vi.spyOn(historyProcessor.logger, 'log')
      // @ts-expect-error - mocking private property
      errorSpy = vi.spyOn(historyProcessor.logger, 'error')

      jobMock = mockDeep<Job<User>>({
        data: { profile: { displayName: 'displayName' } },
      })
      errorMock = new Error('error')
    })

    test('onError', () => {
      historyProcessor.onError(errorMock)

      expect(errorSpy).toHaveBeenCalled()
    })

    test('onFailed', () => {
      historyProcessor.onFailed(jobMock, errorMock)

      expect(errorSpy).toHaveBeenCalledTimes(2)
    })

    test('onActive', () => {
      historyProcessor.onActive(jobMock)

      expect(logSpy).toHaveBeenCalled()
    })

    test('onCompleted', () => {
      historyProcessor.onCompleted(jobMock)

      expect(logSpy).toHaveBeenCalled()
    })

    test('onStalled', () => {
      historyProcessor.onStalled(jobMock)

      expect(errorSpy).toHaveBeenCalled()
    })
  })
})
