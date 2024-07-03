import { Test, TestingModule } from '@nestjs/testing'
import { MockProxy, mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'
import { Between } from 'typeorm'

import { StatsRigtchService } from './stats-rigtch.service'
import { StatsMeasurement } from './enums'

import { HistoryTrack, HistoryTracksRepository } from '@modules/history/tracks'
import { userMock } from '@common/mocks'
import {
  getMostFrequentItems,
  getMostListenedTracksByDuration,
} from '@common/utils'
import { Track } from '@modules/items/tracks'

vi.mock('@common/utils')

describe('StatsRigtchService', () => {
  let moduleRef: TestingModule
  let statsRigtchService: StatsRigtchService
  let historyTracksRepository: HistoryTracksRepository

  let historyTracksMock: MockProxy<HistoryTrack>[]

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        StatsRigtchService,
        {
          provide: HistoryTracksRepository,
          useValue: {
            find: vi.fn(),
          },
        },
      ],
    }).compile()

    statsRigtchService = moduleRef.get(StatsRigtchService)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)

    historyTracksMock = Array.from({ length: 20 }, (_, index) =>
      mock<HistoryTrack>({
        track: {
          id: `id-${index}`,
        },
      })
    )
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(statsRigtchService).toBeDefined()
  })

  describe('getTopTracks', () => {
    const date = new Date()

    let findSpy: MockInstance
    let getMostFrequentItemsSpy: MockInstance
    let getMostListenedTracksByDurationSpy: MockInstance
    let result: Track[]

    beforeEach(() => {
      findSpy = vi.spyOn(historyTracksRepository, 'find')
      getMostFrequentItemsSpy = vi.mocked(getMostFrequentItems)
      getMostListenedTracksByDurationSpy = vi.mocked(
        getMostListenedTracksByDuration
      )

      result = historyTracksMock.slice(0, 10).map(({ track }) => track)
    })

    test('should get top tracks with plays measurement', async () => {
      getMostFrequentItemsSpy.mockReturnValue(
        result.map(({ id }) => ({
          item: id,
          count: 1,
        }))
      )

      findSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopTracks(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      ).toMatchObject(
        historyTracksMock.slice(0, 10).map(({ track }) => ({
          item: track,
          plays: 1,
        }))
      )

      expect(findSpy).toHaveBeenCalledWith({
        where: {
          user: {
            id: userMock.id,
          },
          playedAt: Between(date, date),
        },
        relations: {
          track: {
            artists: true,
            album: true,
          },
        },
      })
      expect(getMostFrequentItemsSpy).toHaveBeenCalled()
      expect(getMostListenedTracksByDurationSpy).not.toHaveBeenCalled()
    })

    test('should get top tracks with play time measurement', async () => {
      getMostListenedTracksByDurationSpy.mockReturnValue(
        result.map(({ id }) => ({
          id,
          totalDuration: 1,
        }))
      )

      findSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopTracks(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      ).toMatchObject(
        historyTracksMock.slice(0, 10).map(({ track }) => ({
          item: track,
          playTime: 1,
        }))
      )

      expect(findSpy).toHaveBeenCalledWith({
        where: {
          user: {
            id: userMock.id,
          },
          playedAt: Between(date, date),
        },
        relations: {
          track: {
            artists: true,
            album: true,
          },
        },
      })
      expect(getMostListenedTracksByDurationSpy).toHaveBeenCalled()
    })
  })
})
