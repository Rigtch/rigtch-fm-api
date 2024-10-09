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

        const result = await reportsService.getListeningDays(
          {
            before,
            after,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )

        for (const [index, { date, value, dayIndex }] of result.entries()) {
          expect(date).toBeInstanceOf(Date)
          expect(value).toBe(COUNT)
          expect(dayIndex).toBe(index + 1)
        }

        expect(countByUserAndBetweenDatesSpy).toHaveBeenCalledTimes(DAYS)
        expect(countByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
          userMock.id,
          expect.any(Date),
          expect.any(Date)
        )
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

        const result = await reportsService.getListeningDays(
          {
            before,
            after,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )

        for (const [index, { date, value, dayIndex }] of result.entries()) {
          expect(date).toBeInstanceOf(Date)
          expect(value).toBe(TOTAL_DURATION)
          expect(dayIndex).toBe(index + 1)
        }

        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledTimes(DAYS)
        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
          userMock.id,
          expect.any(Date),
          expect.any(Date),
          {
            track: true,
          },
          {
            track: {
              duration: true,
            },
          }
        )
      })
    })

    describe('getGenresListeningDays', () => {
      const relations = {
        track: {
          artists: true,
        },
      }
      const select = {
        playedAt: true,
        track: {
          artists: {
            genres: true,
          },
          duration: true,
        },
      }

      test('should get genres listening days with plays measurement', async () => {
        const DAYS = 7
        const before = new Date()
        const after = new Date(Date.now() - 1000 * 60 * 60 * 24 * DAYS)

        const historyTracksMock = Array.from({ length: COUNT }, () =>
          mock<HistoryTrack>({
            playedAt: new Date(),
            track: {
              artists: [
                {
                  genres: ['Pop', 'Rock'],
                },
              ],
            },
          })
        )

        const findByUserAndBetweenDatesSpy = vi
          .spyOn(historyTracksRepository, 'findByUserAndBetweenDates')
          .mockResolvedValue(historyTracksMock)

        const result = await reportsService.getGenresListeningDays(
          { before, after, measurement: StatsMeasurement.PLAYS },
          userMock
        )

        for (const [index, { date, dayIndex, data }] of result.entries()) {
          expect(date).toBeInstanceOf(Date)
          expect(dayIndex).toBe(index + 1)
          expect(data).toHaveProperty('Pop')
          expect(data).toHaveProperty('Rock')
        }

        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
          userMock.id,
          after,
          before,
          relations,
          select
        )
      })

      test('should get genres listening days with play time measurement', async () => {
        const DAYS = 7
        const before = new Date()
        const after = new Date(Date.now() - 1000 * 60 * 60 * 24 * DAYS)

        const historyTracksMock = Array.from({ length: COUNT }, () =>
          mock<HistoryTrack>({
            playedAt: new Date(),
            track: {
              duration: 300,
              artists: [
                {
                  genres: ['Pop', 'Rock'],
                },
              ],
            },
          })
        )

        const findByUserAndBetweenDatesSpy = vi
          .spyOn(historyTracksRepository, 'findByUserAndBetweenDates')
          .mockResolvedValue(historyTracksMock)

        const result = await reportsService.getGenresListeningDays(
          { before, after, measurement: StatsMeasurement.PLAY_TIME },
          userMock
        )

        for (const [index, { date, dayIndex, data }] of result.entries()) {
          expect(date).toBeInstanceOf(Date)
          expect(dayIndex).toBe(index + 1)
          expect(data).toHaveProperty('Pop')
          expect(data).toHaveProperty('Rock')
        }

        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
          userMock.id,
          after,
          before,
          relations,
          select
        )
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

        const getCount = (index: number) =>
          historyTracksMock.filter(
            ({ playedAt }) => playedAt.getHours() === index
          ).length

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
          0: getCount(0),
          1: getCount(1),
          2: getCount(2),
          3: getCount(3),
          4: getCount(4),
          5: getCount(5),
          6: getCount(6),
          7: getCount(7),
          8: getCount(8),
          9: getCount(9),
          10: getCount(10),
          11: getCount(11),
          12: getCount(12),
          13: getCount(13),
          14: getCount(14),
          15: getCount(15),
          16: getCount(16),
          17: getCount(17),
          18: getCount(18),
          19: getCount(19),
          20: getCount(20),
          21: getCount(21),
          22: getCount(22),
          23: getCount(23),
        })

        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
          userMock.id,
          after,
          before,
          {
            track: true,
          },
          {
            playedAt: true,
            track: {
              duration: true,
            },
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

        const getTotalDuration = (index: number) =>
          historyTracksMock
            .filter(({ playedAt }) => playedAt.getHours() === index)
            .map(({ track }) => track.duration)
            .reduce(
              (previousDuration, currentDuration) =>
                previousDuration + currentDuration,
              0
            )

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
          0: getTotalDuration(0),
          1: getTotalDuration(1),
          2: getTotalDuration(2),
          3: getTotalDuration(3),
          4: getTotalDuration(4),
          5: getTotalDuration(5),
          6: getTotalDuration(6),
          7: getTotalDuration(7),
          8: getTotalDuration(8),
          9: getTotalDuration(9),
          10: getTotalDuration(10),
          11: getTotalDuration(11),
          12: getTotalDuration(12),
          13: getTotalDuration(13),
          14: getTotalDuration(14),
          15: getTotalDuration(15),
          16: getTotalDuration(16),
          17: getTotalDuration(17),
          18: getTotalDuration(18),
          19: getTotalDuration(19),
          20: getTotalDuration(20),
          21: getTotalDuration(21),
          22: getTotalDuration(22),
          23: getTotalDuration(23),
        })

        expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
          userMock.id,
          after,
          before,
          {
            track: true,
          },
          {
            playedAt: true,
            track: {
              duration: true,
            },
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

    test('should get total playtime', async () => {
      const after = new Date()
      const before = new Date()

      const findByUserAndBetweenDatesSpy = vi
        .spyOn(historyTracksRepository, 'findByUserAndBetweenDates')
        .mockResolvedValue(historyTracksMock)

      expect(
        await reportsService.getTotalPlaytime(
          {
            before,
            after,
          },
          userMock
        )
      ).toEqual(
        historyTracksMock
          .map(({ track }) => track.duration)
          .reduce(
            (previousDuration, currentDuration) =>
              previousDuration + currentDuration,
            0
          )
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        after,
        before,
        {
          track: true,
        },
        {
          track: {
            duration: true,
          },
        }
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
        },
        {
          track: {
            artists: {
              externalId: true,
            },
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
        },
        {
          track: {
            album: {
              externalId: true,
            },
          },
        }
      )
    })
  })
})
