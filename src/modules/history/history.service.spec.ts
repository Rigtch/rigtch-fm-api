import { Test, TestingModule } from '@nestjs/testing'
import { MockProxy, mock, mockDeep } from 'vitest-mock-extended'
import { AccessToken, MaxInt, PlayHistory } from '@spotify/web-api-ts-sdk'
import { MockInstance } from 'vitest'

import { HistoryService } from './history.service'
import {
  HistoryTrack,
  HistoryTracksRepository,
  HistoryTracksService,
} from './tracks'

import { accessTokenMock, trackEntityMock, userMock } from '@common/mocks'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyPlayerService } from '@modules/spotify/player'
import { QueryRange } from '@modules/spotify/player/types'
import { SdkRecentlyPlayedTracksPage } from '@common/types/spotify'

describe('HistoryService', () => {
  let moduleRef: TestingModule
  let historyService: HistoryService
  let historyTracksRepository: HistoryTracksRepository
  let historyTracksService: HistoryTracksService
  let spotifyAuthService: SpotifyAuthService
  let spotifyPlayerService: SpotifyPlayerService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        HistoryService,
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
          provide: SpotifyAuthService,
          useValue: {
            token: vi.fn(),
          },
        },
        {
          provide: SpotifyPlayerService,
          useValue: {
            getRecentlyPlayedTracks: vi.fn(),
          },
        },
      ],
    }).compile()

    historyService = moduleRef.get(HistoryService)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    historyTracksService = moduleRef.get(HistoryTracksService)
    spotifyAuthService = moduleRef.get(SpotifyAuthService)
    spotifyPlayerService = moduleRef.get(SpotifyPlayerService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyService).toBeDefined()
  })

  describe('synchronize', () => {
    let findLastHistoryTrackByUserSpy: MockInstance
    let createSpy: MockInstance
    let tokenSpy: MockInstance
    let getRecentlyPlayedTracksSpy: MockInstance<
      [
        token: AccessToken,
        limit: MaxInt<50>,
        queryRange?: QueryRange,
        adapt?: false,
      ],
      Promise<SdkRecentlyPlayedTracksPage>
    >

    let playHistoryMock: MockProxy<PlayHistory[]>

    beforeEach(() => {
      playHistoryMock = mock<PlayHistory[]>()

      findLastHistoryTrackByUserSpy = vi.spyOn(
        historyTracksRepository,
        'findLastHistoryTrackByUser'
      )
      createSpy = vi.spyOn(historyTracksService, 'create')
      tokenSpy = vi.spyOn(spotifyAuthService, 'token')
      getRecentlyPlayedTracksSpy = vi.spyOn(
        spotifyPlayerService,
        'getRecentlyPlayedTracks'
      ) as unknown as MockInstance<
        [
          token: AccessToken,
          limit: MaxInt<50>,
          queryRange?: QueryRange,
          adapt?: false,
        ],
        Promise<SdkRecentlyPlayedTracksPage>
      >
    })

    test('should create new history tracks', async () => {
      tokenSpy.mockResolvedValue(accessTokenMock)
      getRecentlyPlayedTracksSpy.mockResolvedValue(
        mockDeep<SdkRecentlyPlayedTracksPage>({
          items: playHistoryMock,
        })
      )

      findLastHistoryTrackByUserSpy.mockResolvedValue(null)

      await historyService.synchronize(userMock)

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

      await historyService.synchronize(userMock)

      expect(createSpy).toHaveBeenCalledWith([playHistory[0]], userMock)
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalled()
    })
  })
})
