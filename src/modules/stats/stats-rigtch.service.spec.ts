import { Test, type TestingModule } from '@nestjs/testing'
import { type MockProxy, mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'

import { StatsRigtchService } from './stats-rigtch.service'
import { StatsMeasurement } from './enums'

import {
  type HistoryTrack,
  HistoryTracksRepository,
} from '@modules/history/tracks'
import { userMock } from '@common/mocks'
import {
  getMostFrequentItems,
  getMostListenedItemsByDuration,
} from '@common/utils'
import type { Track } from '@modules/items/tracks'
import { Artist } from '@modules/items/artists'

vi.mock('@common/utils')

describe('StatsRigtchService', () => {
  const date = new Date()

  let moduleRef: TestingModule
  let statsRigtchService: StatsRigtchService
  let historyTracksRepository: HistoryTracksRepository

  let findByUserAndBetweenDatesSpy: MockInstance
  let getMostFrequentItemsSpy: MockInstance
  let getMostListenedTracksByDurationSpy: MockInstance

  let historyTracksMock: MockProxy<HistoryTrack>[]

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        StatsRigtchService,
        {
          provide: HistoryTracksRepository,
          useValue: {
            findByUserAndBetweenDates: vi.fn(),
          },
        },
      ],
    }).compile()

    statsRigtchService = moduleRef.get(StatsRigtchService)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)

    findByUserAndBetweenDatesSpy = vi.spyOn(
      historyTracksRepository,
      'findByUserAndBetweenDates'
    )
    getMostFrequentItemsSpy = vi.mocked(getMostFrequentItems)
    getMostListenedTracksByDurationSpy = vi.mocked(
      getMostListenedItemsByDuration
    )

    historyTracksMock = Array.from({ length: 20 }, (_, index) =>
      mock<HistoryTrack>({
        track: {
          id: `id-${index}`,
          artists: Array.from({ length: 2 }, (_, index) => ({
            id: `id-artist-${index}`,
          })),
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
    let result: Track[]

    beforeEach(() => {
      result = historyTracksMock.slice(0, 10).map(({ track }) => track)
    })

    test('should get top tracks with plays measurement', async () => {
      getMostFrequentItemsSpy.mockReturnValue(
        result.map(({ id }) => ({
          item: id,
          count: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

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

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date
      )
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
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

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

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date
      )
      expect(getMostListenedTracksByDurationSpy).toHaveBeenCalled()
    })
  })

  describe('getTopArtists', () => {
    let result: Artist[]

    beforeEach(() => {
      result = historyTracksMock
        .flatMap(({ track: { artists } }) => artists)
        .slice(0, 10)
    })

    test('should get top artists with plays measurement', async () => {
      getMostFrequentItemsSpy.mockReturnValue(
        result.map(({ id }) => ({
          item: id,
          count: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopArtists(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      ).toMatchObject(
        result.map(item => ({
          item: item,
          plays: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date
      )
      expect(getMostFrequentItemsSpy).toHaveBeenCalled()
    })

    test('should get top artists with play time measurement', async () => {
      getMostListenedTracksByDurationSpy.mockReturnValue(
        result.map(({ id }) => ({
          id,
          totalDuration: 1,
        }))
      )

      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopArtists(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      ).toMatchObject(
        result.map(item => ({
          item: item,
          playTime: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date
      )
      expect(getMostListenedTracksByDurationSpy).toHaveBeenCalled()
    })
  })
})
