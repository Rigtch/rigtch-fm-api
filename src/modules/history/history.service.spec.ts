import { Test, type TestingModule } from '@nestjs/testing'
import type { MockInstance } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'
import { AccessToken, MaxInt, PlayHistory } from '@spotify/web-api-ts-sdk'

import {
  type HistoryTrack,
  HistoryTracksRepository,
  HistoryTracksService,
} from './tracks'
import { HistoryService } from './history.service'

import { SpotifyService } from '@modules/spotify'
import type { SdkRecentlyPlayedTracksPage } from '@common/types/spotify'
import type { QueryRange } from '@modules/spotify/player/types'
import type { User } from '@modules/users'

type GetRecentlyPlayedMockInstance = MockInstance<
  [
    token: AccessToken,
    limit: MaxInt<50>,
    queryRange?: QueryRange,
    adapt?: false,
  ],
  Promise<SdkRecentlyPlayedTracksPage>
>

describe('HistoryService', () => {
  let moduleRef: TestingModule
  let historyService: HistoryService
  let historyTracksRepository: HistoryTracksRepository
  let historyTracksService: HistoryTracksService
  let spotifyService: SpotifyService

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
          provide: SpotifyService,
          useValue: {
            auth: {
              token: vi.fn(),
            },
            player: {
              getRecentlyPlayedTracks: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    historyService = moduleRef.get(HistoryService)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    historyTracksService = moduleRef.get(HistoryTracksService)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyService).toBeDefined()
  })

  describe('synchronize', () => {
    let tokenSpy: MockInstance
    let findLastHistoryTrackByUserSpy: MockInstance
    let getRecentlyPlayedTracksSpy: MockInstance
    let createSpy: MockInstance

    let accessTokenMock: MockProxy<AccessToken>
    let userMock: MockProxy<User>
    let historyTrackMock: MockProxy<HistoryTrack>
    let playHistoryMock: MockProxy<PlayHistory>

    let createResult: HistoryTrack[]

    beforeEach(() => {
      tokenSpy = vi.spyOn(spotifyService.auth, 'token')
      findLastHistoryTrackByUserSpy = vi.spyOn(
        historyTracksRepository,
        'findLastHistoryTrackByUser'
      )
      getRecentlyPlayedTracksSpy = vi.spyOn(
        spotifyService.player,
        'getRecentlyPlayedTracks'
      ) as unknown as GetRecentlyPlayedMockInstance
      createSpy = vi.spyOn(historyTracksService, 'create')

      accessTokenMock = mock<AccessToken>()
      userMock = mock<User>()
      historyTrackMock = mock<HistoryTrack>()
      playHistoryMock = mock<PlayHistory>()
      createResult = Array.from({ length: 50 }, () => historyTrackMock)

      createSpy.mockResolvedValue(createResult)
    })

    test('should synchronize whole history if lastHistoryTrack has not been found', async () => {
      tokenSpy.mockResolvedValue(accessTokenMock)
      findLastHistoryTrackByUserSpy.mockResolvedValue(null)
      getRecentlyPlayedTracksSpy.mockResolvedValue({
        items: Array.from({ length: 50 }, () => playHistoryMock),
      } as SdkRecentlyPlayedTracksPage)

      expect(await historyService.synchronize(userMock)).toEqual(createResult)

      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        50,
        {},
        false
      )
      expect(createSpy).toHaveBeenCalledWith(
        Array.from({ length: 50 }, () => playHistoryMock),
        userMock
      )
    })

    test('should not synchronize history if lastPlayHistory track is the same as lastHistoryTrack', async () => {
      historyTrackMock = mock<HistoryTrack>({
        playedAt: new Date(),
        track: {
          externalId: 'some id',
        },
      })
      playHistoryMock = mock<PlayHistory>({
        played_at: new Date().toISOString(),
        track: {
          id: 'some id',
        },
      })
      tokenSpy.mockResolvedValue(accessTokenMock)
      findLastHistoryTrackByUserSpy.mockResolvedValue(historyTrackMock)
      getRecentlyPlayedTracksSpy.mockResolvedValue({
        items: Array.from({ length: 50 }, () => playHistoryMock),
      } as SdkRecentlyPlayedTracksPage)

      expect(await historyService.synchronize(userMock)).toEqual([])

      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        1,
        {},
        false
      )
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledTimes(1)
      expect(createSpy).not.toHaveBeenCalled()
    })

    test('should not synchronize history if latestPlayHistory is empty', async () => {
      historyTrackMock = mock<HistoryTrack>({
        playedAt: new Date(Date.now() - 1000),
        track: {
          externalId: 'some id',
        },
      })
      playHistoryMock = mock<PlayHistory>({
        played_at: new Date().toISOString(),
        track: {
          id: 'some id',
        },
      })

      const differentPlayHistoryItem = mock<PlayHistory>({
        played_at: new Date().toISOString(),
        track: {
          id: 'some other id',
        },
      })

      const recentlyPlayedResult = {
        items: [
          ...Array.from({ length: 49 }, () => playHistoryMock),
          differentPlayHistoryItem,
        ],
      }

      tokenSpy.mockResolvedValue(accessTokenMock)
      findLastHistoryTrackByUserSpy.mockResolvedValue(historyTrackMock)
      getRecentlyPlayedTracksSpy
        .mockResolvedValueOnce({
          items: [differentPlayHistoryItem],
        })
        .mockResolvedValue(recentlyPlayedResult)

      expect(await historyService.synchronize(userMock)).toEqual(createResult)

      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledTimes(2)
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        1,
        {},
        false
      )
      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        50,
        {},
        false
      )
    })
  })
})
