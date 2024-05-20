import { Test, TestingModule } from '@nestjs/testing'
import { MockProxy, mock } from 'vitest-mock-extended'
import { PlayHistory } from '@spotify/web-api-ts-sdk'
import { MockInstance } from 'vitest'

import { HistoryService } from './history.service'
import {
  HistoryTrack,
  HistoryTracksRepository,
  HistoryTracksService,
} from './tracks'

import { trackEntityMock, userMock } from '@common/mocks'

describe('HistoryService', () => {
  let moduleRef: TestingModule
  let historyService: HistoryService
  let historyTracksRepository: HistoryTracksRepository
  let historyTracksService: HistoryTracksService

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
      ],
    }).compile()

    historyService = moduleRef.get(HistoryService)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    historyTracksService = moduleRef.get(HistoryTracksService)
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

    let playHistoryMock: MockProxy<PlayHistory[]>

    beforeEach(() => {
      playHistoryMock = mock<PlayHistory[]>()

      findLastHistoryTrackByUserSpy = vi.spyOn(
        historyTracksRepository,
        'findLastHistoryTrackByUser'
      )
      createSpy = vi.spyOn(historyTracksService, 'create')
    })

    test('should create new history tracks', async () => {
      findLastHistoryTrackByUserSpy.mockResolvedValue(null)

      await historyService.synchronize(userMock, playHistoryMock)

      expect(createSpy).toHaveBeenCalledWith(playHistoryMock, userMock)
    })

    test('should create only new history tracks', async () => {
      const externalId = 'externalId'
      const playedAt = new Date()

      const lastHistoryTrack = mock<HistoryTrack>({
        track: { ...trackEntityMock, externalId },
        playedAt,
      })

      findLastHistoryTrackByUserSpy.mockResolvedValue(lastHistoryTrack)

      const playHistory = [
        mock<PlayHistory>({
          track: { id: externalId },
          played_at: playedAt.toISOString(),
        }),
        mock<PlayHistory>(),
      ]

      await historyService.synchronize(userMock, playHistory)

      expect(createSpy).toHaveBeenCalledWith([playHistory[1]], userMock)
    })
  })
})
