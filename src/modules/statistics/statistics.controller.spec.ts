import { Test, TestingModule } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

import { formattedTrackMock } from '@common/mocks'

describe('StatisticsController', () => {
  let statisticsController: StatisticsController
  let statisticsService: StatisticsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsController,
        {
          provide: StatisticsService,
          useValue: {
            lastTracks: jest.fn(),
            topTracks: jest.fn(),
            topGenres: jest.fn(),
            topArtists: jest.fn(),
            artist: jest.fn(),
          },
        },
      ],
    }).compile()

    statisticsController =
      module.get<StatisticsController>(StatisticsController)
    statisticsService = module.get<StatisticsService>(StatisticsService)
  })

  it('should be defined', () => {
    expect(statisticsController).toBeDefined()
  })

  describe('LastTracks', () => {
    it('should query last tracks', async () => {
      statisticsService.lastTracks = jest
        .fn()
        .mockReturnValue(of([formattedTrackMock]))

      expect(
        await firstValueFrom(statisticsController.lastTracks('awd', {}))
      ).toEqual([formattedTrackMock])
    })

    it('should query last tracks with limit argument', async () => {
      const limit = 20

      const formattedTrackWithLimitMock = Array.from(
        { length: limit },
        () => formattedTrackMock
      )

      statisticsService.lastTracks = jest
        .fn()
        .mockReturnValue(of(formattedTrackWithLimitMock))

      expect(
        await firstValueFrom(statisticsController.lastTracks('awd', { limit }))
      ).toEqual(formattedTrackWithLimitMock)
    })
  })

  describe('TopTracks', () => {
    it('should query top tracks', async () => {
      statisticsService.topTracks = jest
        .fn()
        .mockReturnValue(of([formattedTrackMock]))

      expect(
        await firstValueFrom(statisticsController.topTracks('awd', {}))
      ).toEqual([formattedTrackMock])
    })

    it('should query top tracks with limit argument', async () => {
      const limit = 20

      const formattedTrackWithLimitMock = Array.from(
        { length: limit },
        () => formattedTrackMock
      )

      statisticsService.topTracks = jest
        .fn()
        .mockReturnValue(of(formattedTrackWithLimitMock))

      expect(
        await firstValueFrom(statisticsController.topTracks('awd', { limit }))
      ).toEqual(formattedTrackWithLimitMock)
    })
  })

  describe('TopGenres', () => {
    it('should query top genres', async () => {
      statisticsService.topGenres = jest
        .fn()
        .mockReturnValue(of([formattedTrackMock]))

      expect(
        await firstValueFrom(statisticsController.topGenres('awd', {}))
      ).toEqual([formattedTrackMock])
    })

    it('should query top genres with limit argument', async () => {
      const limit = 20

      const formattedTrackWithLimitMock = Array.from(
        { length: limit },
        () => formattedTrackMock
      )

      statisticsService.topGenres = jest
        .fn()
        .mockReturnValue(of(formattedTrackWithLimitMock))

      expect(
        await firstValueFrom(statisticsController.topGenres('awd', { limit }))
      ).toEqual(formattedTrackWithLimitMock)
    })
  })

  describe('TopArtists', () => {
    it('should query top artists', async () => {
      statisticsService.topArtists = jest
        .fn()
        .mockReturnValue(of([formattedTrackMock]))

      expect(
        await firstValueFrom(statisticsController.topArtists('awd', {}))
      ).toEqual([formattedTrackMock])
    })

    it('should query top artists with limit argument', async () => {
      const limit = 20

      const formattedTrackWithLimitMock = Array.from(
        { length: limit },
        () => formattedTrackMock
      )

      statisticsService.topArtists = jest
        .fn()
        .mockReturnValue(of(formattedTrackWithLimitMock))

      expect(
        await firstValueFrom(statisticsController.topArtists('awd', { limit }))
      ).toEqual(formattedTrackWithLimitMock)
    })
  })

  it('should query artist', async () => {
    statisticsService.artist = jest.fn().mockReturnValue(of(formattedTrackMock))

    expect(
      await firstValueFrom(statisticsController.artist('awd', '123'))
    ).toEqual(formattedTrackMock)
  })
})
