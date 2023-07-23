import { Test, TestingModule } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

import {
  analysisMock,
  formattedArtistMock,
  formattedArtistsMock,
  formattedTrackMock,
  topGenresMock,
} from '@common/mocks'

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
            analysis: jest.fn(),
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
      jest
        .spyOn(statisticsService, 'lastTracks')
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

      jest
        .spyOn(statisticsService, 'lastTracks')
        .mockReturnValue(of(formattedTrackWithLimitMock))

      expect(
        await firstValueFrom(statisticsController.lastTracks('awd', { limit }))
      ).toEqual(formattedTrackWithLimitMock)
    })
  })

  describe('TopTracks', () => {
    it('should query top tracks', async () => {
      jest
        .spyOn(statisticsService, 'topTracks')
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

      jest
        .spyOn(statisticsService, 'topTracks')
        .mockReturnValue(of(formattedTrackWithLimitMock))

      expect(
        await firstValueFrom(statisticsController.topTracks('awd', { limit }))
      ).toEqual(formattedTrackWithLimitMock)
    })
  })

  describe('TopGenres', () => {
    it('should query top genres', async () => {
      jest
        .spyOn(statisticsService, 'topGenres')
        .mockReturnValue(of(topGenresMock))

      expect(
        await firstValueFrom(statisticsController.topGenres('awd', {}))
      ).toEqual(topGenresMock)
    })

    it('should query top genres with limit argument', async () => {
      const limit = 20

      const genresWithLimitMock = {
        genres: Array.from({ length: limit }, () => 'genre'),
      }

      jest
        .spyOn(statisticsService, 'topGenres')
        .mockReturnValue(of(genresWithLimitMock))

      expect(
        await firstValueFrom(statisticsController.topGenres('awd', { limit }))
      ).toEqual(genresWithLimitMock)
    })
  })

  describe('TopArtists', () => {
    it('should query top artists', async () => {
      jest
        .spyOn(statisticsService, 'topArtists')
        .mockReturnValue(of(formattedArtistsMock))

      expect(
        await firstValueFrom(statisticsController.topArtists('awd', {}))
      ).toEqual(formattedArtistsMock)
    })

    it('should query top artists with limit argument', async () => {
      const limit = 20

      const formattedArtistsWithLimitMock = Array.from(
        { length: limit },
        () => formattedArtistMock
      )

      jest
        .spyOn(statisticsService, 'topArtists')
        .mockReturnValue(of(formattedArtistsWithLimitMock))

      expect(
        await firstValueFrom(statisticsController.topArtists('awd', { limit }))
      ).toEqual(formattedArtistsWithLimitMock)
    })
  })

  it('should query artist', async () => {
    jest
      .spyOn(statisticsService, 'artist')
      .mockReturnValue(of(formattedArtistMock))

    expect(
      await firstValueFrom(statisticsController.artist('awd', '123'))
    ).toEqual(formattedArtistMock)
  })

  it('should get analysis', async () => {
    jest.spyOn(statisticsService, 'analysis').mockReturnValue(of(analysisMock))

    expect(await firstValueFrom(statisticsController.analysis('awd'))).toEqual(
      analysisMock
    )
  })
})
