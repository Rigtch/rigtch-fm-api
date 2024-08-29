import { Test, type TestingModule } from '@nestjs/testing'
import { mock, type MockProxy } from 'vitest-mock-extended'
import { type MockInstance } from 'vitest'

import { ReportsService } from './reports.service'

import {
  type HistoryTrack,
  HistoryTracksRepository,
} from '@modules/history/tracks'
import { userMock } from '@common/mocks'
import { Artist } from '@modules/items/artists'
import { Album } from '@modules/items/albums'
import { StatsMeasurement } from '@modules/stats/enums'

describe('ReportsService', () => {
  const COUNT = 10

  let moduleRef: TestingModule
  let reportsService: ReportsService
  let historyTracksRepository: HistoryTracksRepository

  let historyTracksMock: MockProxy<HistoryTrack>[]

  let findByUserAndBetweenDatesSpy: MockInstance

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: HistoryTracksRepository,
          useValue: {
            findByUserAndBetweenDates: vi.fn(),
            countByUserAndBetweenDates: vi.fn(),
          },
        },
      ],
    }).compile()

    reportsService = moduleRef.get(ReportsService)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)

    findByUserAndBetweenDatesSpy = vi
      .spyOn(historyTracksRepository, 'findByUserAndBetweenDates')
      .mockResolvedValue(historyTracksMock)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(reportsService).toBeDefined()
  })

  describe('ListeningCharts', () => {
    const DAYS = 7
    const before = new Date()
    const after = new Date(Date.now() - 1000 * 60 * 60 * 24 * DAYS)

    describe('getListeningDays', () => {
      test('should get listening days with plays measurement', async () => {
        const countByUserAndBetweenDatesSpy = vi
          .spyOn(historyTracksRepository, 'countByUserAndBetweenDates')
          .mockResolvedValue(COUNT)

        expect(
          await reportsService.getListeningDays(
            {
              before,
              after,
              measurement: StatsMeasurement.PLAYS,
            },
            userMock
          )
        ).toEqual({
          1: COUNT,
          2: COUNT,
          3: COUNT,
          4: COUNT,
          5: COUNT,
          6: COUNT,
          7: COUNT,
        })

        expect(countByUserAndBetweenDatesSpy).toHaveBeenCalledTimes(DAYS)
      })

      test('should get listening days with play time measurement', async () => {
        const DURATION = 1000
        const TOTAL_DURATION = DURATION * COUNT

        historyTracksMock = Array.from({ length: COUNT }, () =>
          mock<HistoryTrack>({
            track: {
              duration: DURATION,
            },
          })
        )

        const findByUserAndBetweenDatesSpy = vi
          .spyOn(historyTracksRepository, 'findByUserAndBetweenDates')
          .mockResolvedValue(historyTracksMock)

        expect(
          await reportsService.getListeningDays(
            {
              before,
              after,
              measurement: StatsMeasurement.PLAY_TIME,
            },
            userMock
          )
        ).toEqual({
          1: TOTAL_DURATION,
          2: TOTAL_DURATION,
          3: TOTAL_DURATION,
          4: TOTAL_DURATION,
          5: TOTAL_DURATION,
          6: TOTAL_DURATION,
          7: TOTAL_DURATION,
        })

        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledTimes(DAYS)
      })
    })

    describe('getListeningHours', () => {
      test('should get listening hours with plays measurement', async () => {
        historyTracksMock = Array.from({ length: COUNT }, (_, index) =>
          mock<HistoryTrack>({
            playedAt: new Date(
              new Date('2024-08-22T08:59:38.340Z').getTime() -
                1000 * 60 * 60 * (index + 1)
            ),
          })
        )

        const findByUserAndBetweenDatesSpy = vi
          .spyOn(historyTracksRepository, 'findByUserAndBetweenDates')
          .mockResolvedValue(historyTracksMock)

        expect(
          await reportsService.getListeningHours(
            {
              before,
              after,
              measurement: StatsMeasurement.PLAYS,
            },
            userMock
          )
        ).toEqual({
          1: 1,
          2: 1,
          3: 1,
          4: 1,
          5: 1,
          6: 1,
          7: 1,
          8: 1,
          9: 1,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
          16: 0,
          17: 0,
          18: 0,
          19: 0,
          20: 0,
          21: 0,
          22: 0,
          23: 0,
          24: 0,
        })

        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
          userMock.id,
          after,
          before,
          {
            track: true,
          }
        )
      })

      test('should get listening hours with play time measurement', async () => {
        const DURATION = 1000

        historyTracksMock = Array.from({ length: COUNT }, (_, index) =>
          mock<HistoryTrack>({
            track: {
              duration: DURATION,
            },
            playedAt: new Date(
              new Date('2024-08-22T08:59:38.340Z').getTime() -
                1000 * 60 * 60 * (index + 1)
            ),
          })
        )

        const findByUserAndBetweenDatesSpy = vi
          .spyOn(historyTracksRepository, 'findByUserAndBetweenDates')
          .mockResolvedValue(historyTracksMock)

        expect(
          await reportsService.getListeningHours(
            {
              before,
              after,
              measurement: StatsMeasurement.PLAY_TIME,
            },
            userMock
          )
        ).toEqual({
          1: DURATION,
          2: DURATION,
          3: DURATION,
          4: DURATION,
          5: DURATION,
          6: DURATION,
          7: DURATION,
          8: DURATION,
          9: DURATION,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
          16: 0,
          17: 0,
          18: 0,
          19: 0,
          20: 0,
          21: 0,
          22: 0,
          23: 0,
          24: 0,
        })

        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
          userMock.id,
          after,
          before,
          {
            track: true,
          }
        )
      })
    })
  })

  describe('TotalItems', () => {
    beforeEach(() => {
      historyTracksMock = Array.from({ length: COUNT }, () =>
        mock<HistoryTrack>({
          track: {
            artists: [mock<Artist>()],
            album: mock<Album>(),
          },
        })
      )
    })

    test('should get total tracks', async () => {
      const after = new Date()
      const before = new Date()

      const countByUserAndBetweenDatesSpy = vi
        .spyOn(historyTracksRepository, 'countByUserAndBetweenDates')
        .mockResolvedValue(COUNT)

      expect(
        await reportsService.getTotalTracks(
          {
            before,
            after,
          },
          userMock
        )
      ).toEqual(COUNT)

      expect(countByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        after,
        before
      )
    })

    test('should get total artists', async () => {
      const after = new Date()
      const before = new Date()

      expect(
        await reportsService.getTotalArtists({ before, after }, userMock)
      ).toEqual(historyTracksMock.flatMap(({ track }) => track.artists).length)

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        after,
        before,
        {
          track: {
            artists: true,
          },
        }
      )
    })

    test('should get total albums', async () => {
      const after = new Date()
      const before = new Date()

      expect(
        await reportsService.getTotalAlbums({ before, after }, userMock)
      ).toEqual(historyTracksMock.flatMap(({ track }) => track.album).length)

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        after,
        before,
        {
          track: {
            album: true,
          },
        }
      )
    })
  })
})
