import { SchedulerRegistry } from '@nestjs/schedule'
import { Test } from '@nestjs/testing'
import { mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'
import { AccessToken, MaxInt } from '@spotify/web-api-ts-sdk'
import { ConfigService } from '@nestjs/config'

import { HistoryScheduler } from './history.scheduler'
import { History } from './history.entity'
import { HistoryService } from './history.service'

import { UsersRepository } from '@modules/users'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyPlayerService } from '@modules/spotify/player'
import { accessTokenMock, userMock, usersMock } from '@common/mocks'
import { SdkRecentlyPlayedTracksPage } from '@common/types/spotify'
import { QueryRange } from '@modules/spotify/player/types'

describe('HistoryScheduler', () => {
  let historyScheduler: HistoryScheduler
  let usersRepository: UsersRepository
  let spotifyAuthService: SpotifyAuthService
  let spotifyPlayerService: SpotifyPlayerService
  let historyService: HistoryService
  let schedulerRegistry: SchedulerRegistry

  beforeEach(async () => {
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(((
      callback: () => void
    ) => {
      callback()
    }) as unknown as typeof setTimeout)

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UsersRepository,
          useValue: {
            findUsers: vi.fn(),
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
        {
          provide: HistoryService,
          useValue: {
            updateOrCreate: vi.fn(),
          },
        },
        {
          provide: SchedulerRegistry,
          useValue: {
            addInterval: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('1m'),
          },
        },
        HistoryScheduler,
      ],
    }).compile()

    historyScheduler = module.get(HistoryScheduler)
    usersRepository = module.get(UsersRepository)
    spotifyAuthService = module.get(SpotifyAuthService)
    spotifyPlayerService = module.get(SpotifyPlayerService)
    historyService = module.get(HistoryService)
    schedulerRegistry = module.get(SchedulerRegistry)
  })

  test('should be defined', () => {
    expect(historyScheduler).toBeDefined()
  })

  test('should schedule history fetching for users in onModuleInit', async () => {
    const findUsersSpy = vi
      .spyOn(usersRepository, 'findUsers')
      .mockResolvedValue(usersMock)
    const triggerFetchingUserHistorySpy = vi
      .spyOn(historyScheduler, 'triggerFetchingUserHistory')
      .mockResolvedValue()

    await historyScheduler.onModuleInit()

    expect(findUsersSpy).toHaveBeenCalledWith()
    expect(triggerFetchingUserHistorySpy).toHaveBeenCalledTimes(
      usersMock.length
    )
  })

  test('should trigger fetching user history', () => {
    vi.spyOn(historyScheduler, 'fetchUserHistory')
    const addIntervalSpy = vi.spyOn(schedulerRegistry, 'addInterval')

    historyScheduler.triggerFetchingUserHistory(userMock)

    expect(addIntervalSpy).toHaveBeenCalledWith(
      `fetch-history-${userMock.id}`,
      expect.anything()
    )
  })

  test('should fetch user history', async () => {
    const recentlyPlayedTracksPageMock = mock<SdkRecentlyPlayedTracksPage>()

    const tokenSpy = vi
      .spyOn(spotifyAuthService, 'token')
      .mockResolvedValue(accessTokenMock)
    const getRecentlyPlayedTracksSpy = (
      vi.spyOn(
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
    ).mockResolvedValue(recentlyPlayedTracksPageMock)
    const updateOrCreateHistoryByUserSpy = vi
      .spyOn(historyService, 'updateOrCreate')
      .mockResolvedValue(mock<History>())

    await historyScheduler.fetchUserHistory(userMock)

    expect(tokenSpy).toHaveBeenCalledWith({
      refreshToken: userMock.refreshToken,
    })
    expect(getRecentlyPlayedTracksSpy).toHaveBeenCalled()
    expect(updateOrCreateHistoryByUserSpy).toHaveBeenCalledWith(
      userMock,
      recentlyPlayedTracksPageMock.items
    )
  })
})
