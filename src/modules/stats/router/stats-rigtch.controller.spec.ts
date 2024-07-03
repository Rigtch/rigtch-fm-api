import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { StatsRigtchService } from '../stats-rigtch.service'
import { StatsMeasurement } from '../enums'

import { StatsRigtchController } from './stats-rigtch.controller'

import { albumMock, artistMock, trackMock, userMock } from '@common/mocks'
import { UsersRepository } from '@modules/users'

describe('StatsRigtchController', () => {
  const date = new Date()

  let moduleRef: TestingModule
  let statsRigtchController: StatsRigtchController
  let statsRigtchService: StatsRigtchService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [StatsRigtchController],
      providers: [
        {
          provide: StatsRigtchService,
          useValue: {
            getTopTracks: vi.fn(),
            getTopArtists: vi.fn(),
            getTopAlbums: vi.fn(),
            getTopGenres: vi.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: vi.fn(),
      })
      .compile()

    statsRigtchController = moduleRef.get(StatsRigtchController)
    statsRigtchService = moduleRef.get(StatsRigtchService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(statsRigtchController).toBeDefined()
  })

  describe('getTopTracks', () => {
    let getTopTracksSpy: MockInstance

    beforeEach(() => {
      getTopTracksSpy = vi.spyOn(statsRigtchService, 'getTopTracks')
    })

    test('should get top tracks', async () => {
      const limit = 10
      const result = Array.from({ length: limit }, () => trackMock)

      getTopTracksSpy.mockResolvedValue(result)

      expect(
        await statsRigtchController.getTopTracks(userMock, {
          before: date,
          after: date,
          limit: 10,
          measurement: StatsMeasurement.PLAYS,
        })
      ).toEqual(result)

      expect(getTopTracksSpy).toHaveBeenCalledWith(
        {
          before: date,
          after: date,
          limit,
          measurement: StatsMeasurement.PLAYS,
        },
        userMock
      )
    })
  })

  describe('getTopArtists', () => {
    let getTopArtistsSpy: MockInstance

    beforeEach(() => {
      getTopArtistsSpy = vi.spyOn(statsRigtchService, 'getTopArtists')
    })

    test('should get top artists', async () => {
      const limit = 10
      const result = Array.from({ length: limit }, () => artistMock)

      getTopArtistsSpy.mockResolvedValue(result)

      expect(
        await statsRigtchController.getTopArtists(userMock, {
          before: date,
          after: date,
          limit: 10,
          measurement: StatsMeasurement.PLAYS,
        })
      ).toEqual(result)

      expect(getTopArtistsSpy).toHaveBeenCalledWith(
        {
          before: date,
          after: date,
          limit,
          measurement: StatsMeasurement.PLAYS,
        },
        userMock
      )
    })
  })

  describe('getTopAlbums', () => {
    let getTopAlbumsSpy: MockInstance

    beforeEach(() => {
      getTopAlbumsSpy = vi.spyOn(statsRigtchService, 'getTopAlbums')
    })

    test('should get top albums', async () => {
      const limit = 10
      const result = Array.from({ length: limit }, () => albumMock)

      getTopAlbumsSpy.mockResolvedValue(result)

      expect(
        await statsRigtchController.getTopAlbums(userMock, {
          before: date,
          after: date,
          limit: 10,
          measurement: StatsMeasurement.PLAYS,
        })
      ).toEqual(result)

      expect(getTopAlbumsSpy).toHaveBeenCalledWith(
        {
          before: date,
          after: date,
          limit,
          measurement: StatsMeasurement.PLAYS,
        },
        userMock
      )
    })
  })

  describe('getTopGenres', () => {
    let getTopGenresSpy: MockInstance

    beforeEach(() => {
      getTopGenresSpy = vi.spyOn(statsRigtchService, 'getTopGenres')
    })

    test('should get top genres', async () => {
      const limit = 10
      const result = Array.from({ length: limit }, () => 'genre')

      getTopGenresSpy.mockResolvedValue(result)

      expect(
        await statsRigtchController.getTopGenres(userMock, {
          before: date,
          after: date,
          limit: 10,
          measurement: StatsMeasurement.PLAYS,
        })
      ).toEqual(result)

      expect(getTopGenresSpy).toHaveBeenCalledWith(
        {
          before: date,
          after: date,
          limit,
          measurement: StatsMeasurement.PLAYS,
        },
        userMock
      )
    })
  })
})
