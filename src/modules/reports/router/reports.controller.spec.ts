import { Test, type TestingModule } from '@nestjs/testing'

import { ReportsService } from '../reports.service'

import { ReportsController } from './reports.controller'
import { GenresListeningDaysDocument } from './docs'

import { UsersRepository } from '@modules/users'
import { userMock } from '@common/mocks'
import { StatsMeasurement } from '@modules/stats/enums'

describe('ReportsController', () => {
  const before = new Date()
  const after = new Date()

  let moduleRef: TestingModule
  let reportsController: ReportsController
  let reportsService: ReportsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: {
            getListeningDays: vi.fn(),
            getGenresListeningDays: vi.fn(),
            getListeningHours: vi.fn(),
            getTotalPlaytime: vi.fn(),
            getTotalPlays: vi.fn(),
            getTotalGenres: vi.fn(),
            getTotalTracks: vi.fn(),
            getTotalArtists: vi.fn(),
            getTotalAlbums: vi.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
      ],
    }).compile()

    reportsController = moduleRef.get(ReportsController)
    reportsService = moduleRef.get(ReportsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(reportsController).toBeDefined()
  })

  describe('ListeningCharts', () => {
    describe('getListeningDays', () => {
      const listeningDaysArray = [
        {
          date: new Date('2024-08-22T08:59:38.340Z'),
          dayIndex: 1,
          value: 10,
        },
        {
          date: new Date('2024-08-23T08:59:38.340Z'),
          dayIndex: 2,
          value: 10,
        },
        {
          date: new Date('2024-08-24T08:59:38.340Z'),
          dayIndex: 3,
          value: 10,
        },
        {
          date: new Date('2024-08-25T08:59:38.340Z'),
          dayIndex: 4,
          value: 10,
        },
        {
          date: new Date('2024-08-26T08:59:38.340Z'),
          dayIndex: 5,
          value: 10,
        },
        {
          date: new Date('2024-08-27T08:59:38.340Z'),
          dayIndex: 6,
          value: 10,
        },
        {
          date: new Date('2024-08-28T08:59:38.340Z'),
          dayIndex: 7,
          value: 10,
        },
      ]

      test('should get listening days with plays measurement', async () => {
        const getListeningDaysSpy = vi
          .spyOn(reportsService, 'getListeningDays')
          .mockResolvedValue(listeningDaysArray)

        expect(
          await reportsController.getListeningDays(userMock, {
            before,
            after,
          })
        ).toEqual(listeningDaysArray)

        expect(getListeningDaysSpy).toHaveBeenCalledWith(
          {
            before,
            after,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      })

      test('should get listening days with play time measurement', async () => {
        const getListeningDaysSpy = vi
          .spyOn(reportsService, 'getListeningDays')
          .mockResolvedValue(listeningDaysArray)

        expect(
          await reportsController.getListeningDays(userMock, {
            before,
            after,
            measurement: StatsMeasurement.PLAY_TIME,
          })
        ).toEqual(listeningDaysArray)

        expect(getListeningDaysSpy).toHaveBeenCalledWith(
          {
            before,
            after,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      })
    })

    describe('GenresListeningDays', () => {
      const genresListeningDaysArray: GenresListeningDaysDocument[] = [
        {
          dayIndex: 1,
          data: {
            Pop: 30,
          },
          date: new Date('2024-08-22T08:59:38.340Z'),
        },
        {
          dayIndex: 2,
          data: {
            Rock: 20,
          },
          date: new Date('2024-08-23T08:59:38.340Z'),
        },
        {
          dayIndex: 3,
          data: {
            Jazz: 10,
          },
          date: new Date('2024-08-24T08:59:38.340Z'),
        },
      ]

      test('should get genres listening days with plays measurement', async () => {
        const getGenresListeningDaysSpy = vi
          .spyOn(reportsService, 'getGenresListeningDays')
          .mockResolvedValue(genresListeningDaysArray)

        expect(
          await reportsController.getGenresListeningDays(userMock, {
            before,
            after,
          })
        ).toEqual(genresListeningDaysArray)

        expect(getGenresListeningDaysSpy).toHaveBeenCalledWith(
          {
            before,
            after,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      })

      test('should get genres listening days with play time measurement', async () => {
        const getGenresListeningDaysSpy = vi
          .spyOn(reportsService, 'getGenresListeningDays')
          .mockResolvedValue(genresListeningDaysArray)

        expect(
          await reportsController.getGenresListeningDays(userMock, {
            before,
            after,
            measurement: StatsMeasurement.PLAY_TIME,
          })
        ).toEqual(genresListeningDaysArray)

        expect(getGenresListeningDaysSpy).toHaveBeenCalledWith(
          {
            before,
            after,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      })
    })

    describe('getListeningHours', () => {
      const listeningHoursObject = {
        1: 10,
        2: 10,
        3: 10,
        4: 10,
        5: 10,
        6: 10,
        7: 10,
        8: 10,
        9: 10,
        10: 10,
        11: 10,
        12: 10,
        13: 10,
        14: 10,
        15: 10,
        16: 10,
        17: 10,
        18: 10,
        19: 10,
        20: 10,
        21: 10,
        22: 10,
        23: 10,
        24: 10,
      }

      test('should get listening hours with plays measurement', async () => {
        const getListeningHoursSpy = vi
          .spyOn(reportsService, 'getListeningHours')
          .mockResolvedValue(listeningHoursObject)

        expect(
          await reportsController.getListeningHours(userMock, {
            before,
            after,
          })
        ).toEqual(listeningHoursObject)

        expect(getListeningHoursSpy).toHaveBeenCalledWith(
          {
            before,
            after,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      })

      test('should get listening hours with play time measurement', async () => {
        const getListeningHoursSpy = vi
          .spyOn(reportsService, 'getListeningHours')
          .mockResolvedValue(listeningHoursObject)

        expect(
          await reportsController.getListeningHours(userMock, {
            before,
            after,
            measurement: StatsMeasurement.PLAY_TIME,
          })
        ).toEqual(listeningHoursObject)

        expect(getListeningHoursSpy).toHaveBeenCalledWith(
          {
            before,
            after,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      })
    })

    describe('TotalItems', () => {
      const COUNT = 10

      describe('getTotalPlaytime', () => {
        test('should get total playtime', async () => {
          const getTotalPlaytimeSpy = vi
            .spyOn(reportsService, 'getTotalPlaytime')
            .mockResolvedValue(COUNT)

          expect(
            await reportsController.getTotalPlaytime(userMock, {
              before,
              after,
            })
          ).toEqual({
            total: COUNT,
          })

          expect(getTotalPlaytimeSpy).toHaveBeenCalledWith(
            {
              before,
              after,
            },
            userMock
          )
        })
      })

      describe('getTotalPlays', () => {
        test('should get total plays', async () => {
          const getTotalPlaysSpy = vi
            .spyOn(reportsService, 'getTotalPlays')
            .mockResolvedValue(COUNT)

          expect(
            await reportsController.getTotalPlays(userMock, {
              before,
              after,
            })
          ).toEqual({
            total: COUNT,
          })

          expect(getTotalPlaysSpy).toHaveBeenCalledWith(
            {
              before,
              after,
            },
            userMock
          )
        })
      })

      describe('getTotalGenres', () => {
        test('should get total genres', async () => {
          const getTotalGenresSpy = vi
            .spyOn(reportsService, 'getTotalGenres')
            .mockResolvedValue(COUNT)

          expect(
            await reportsController.getTotalGenres(userMock, {
              before,
              after,
            })
          ).toEqual({
            total: COUNT,
          })

          expect(getTotalGenresSpy).toHaveBeenCalledWith(
            {
              before,
              after,
            },
            userMock
          )
        })
      })

      describe('getTotalTracks', () => {
        test('should get total tracks', async () => {
          const getTotalTracksSpy = vi
            .spyOn(reportsService, 'getTotalTracks')
            .mockResolvedValue(COUNT)

          expect(
            await reportsController.getTotalTracks(userMock, {
              before,
              after,
            })
          ).toEqual({
            total: COUNT,
          })

          expect(getTotalTracksSpy).toHaveBeenCalledWith(
            {
              before,
              after,
            },
            userMock
          )
        })
      })

      describe('getTotalArtists', () => {
        test('should get total artists', async () => {
          const getTotalArtistsSpy = vi
            .spyOn(reportsService, 'getTotalArtists')
            .mockResolvedValue(COUNT)

          expect(
            await reportsController.getTotalArtists(userMock, {
              before,
              after,
            })
          ).toEqual({
            total: COUNT,
          })

          expect(getTotalArtistsSpy).toHaveBeenCalledWith(
            {
              before,
              after,
            },
            userMock
          )
        })
      })

      describe('getTotalAlbums', () => {
        test('should get total albums', async () => {
          const getTotalAlbumsSpy = vi
            .spyOn(reportsService, 'getTotalAlbums')
            .mockResolvedValue(COUNT)

          expect(
            await reportsController.getTotalAlbums(userMock, {
              before,
              after,
            })
          ).toEqual({
            total: COUNT,
          })

          expect(getTotalAlbumsSpy).toHaveBeenCalledWith(
            {
              before,
              after,
            },
            userMock
          )
        })
      })
    })
  })
})
