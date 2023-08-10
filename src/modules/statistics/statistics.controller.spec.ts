import { test, describe, expect, beforeEach, vi } from 'vitest'
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
            lastTracks: vi.fn(),
            topTracks: vi.fn(),
            topGenres: vi.fn(),
            topArtists: vi.fn(),
            artist: vi.fn(),
            analysis: vi.fn(),
          },
        },
      ],
    }).compile()

    statisticsController =
      module.get<StatisticsController>(StatisticsController)
    statisticsService = module.get<StatisticsService>(StatisticsService)
  })

  test('should be defined', () => {
    expect(statisticsController).toBeDefined()
  })

  describe('LastTracks', () => {
    test('should get last tracks', async () => {
      vi.spyOn(statisticsService, 'lastTracks').mockReturnValue(
        of([formattedTrackMock])
      )

      expect(
        await firstValueFrom(statisticsController.lastTracks('awd', {}))
      ).toEqual([formattedTrackMock])
    })

    test('should get last tracks with limit query', async () => {
      const limit = 20

      const formattedTrackWithLimitMock = Array.from(
        { length: limit },
        () => formattedTrackMock
      )

      vi.spyOn(statisticsService, 'lastTracks').mockReturnValue(
        of(formattedTrackWithLimitMock)
      )

      expect(
        await firstValueFrom(statisticsController.lastTracks('awd', { limit }))
      ).toEqual(formattedTrackWithLimitMock)
    })
  })

  describe('TopTracks', () => {
    test('should get top tracks', async () => {
      vi.spyOn(statisticsService, 'topTracks').mockReturnValue(
        of([formattedTrackMock])
      )

      expect(
        await firstValueFrom(statisticsController.topTracks('awd', {}))
      ).toEqual([formattedTrackMock])
    })

    test('should get top tracks with limit query', async () => {
      const limit = 20

      const formattedTrackWithLimitMock = Array.from(
        { length: limit },
        () => formattedTrackMock
      )

      vi.spyOn(statisticsService, 'topTracks').mockReturnValue(
        of(formattedTrackWithLimitMock)
      )

      expect(
        await firstValueFrom(statisticsController.topTracks('awd', { limit }))
      ).toEqual(formattedTrackWithLimitMock)
    })
  })

  describe('TopGenres', () => {
    test('should get top genres', async () => {
      vi.spyOn(statisticsService, 'topGenres').mockReturnValue(
        of(topGenresMock)
      )

      expect(
        await firstValueFrom(statisticsController.topGenres('awd', {}))
      ).toEqual(topGenresMock)
    })

    test('should get top genres with limit argument', async () => {
      const limit = 20

      const genresWithLimitMock = {
        genres: Array.from({ length: limit }, () => 'genre'),
      }

      vi.spyOn(statisticsService, 'topGenres').mockReturnValue(
        of(genresWithLimitMock)
      )

      expect(
        await firstValueFrom(statisticsController.topGenres('awd', { limit }))
      ).toEqual(genresWithLimitMock)
    })
  })

  describe('TopArtists', () => {
    test('should get top artists', async () => {
      vi.spyOn(statisticsService, 'topArtists').mockReturnValue(
        of(formattedArtistsMock)
      )

      expect(
        await firstValueFrom(statisticsController.topArtists('awd', {}))
      ).toEqual(formattedArtistsMock)
    })

    test('should get top artists with limit argument', async () => {
      const limit = 20

      const formattedArtistsWithLimitMock = Array.from(
        { length: limit },
        () => formattedArtistMock
      )

      vi.spyOn(statisticsService, 'topArtists').mockReturnValue(
        of(formattedArtistsWithLimitMock)
      )

      expect(
        await firstValueFrom(statisticsController.topArtists('awd', { limit }))
      ).toEqual(formattedArtistsWithLimitMock)
    })
  })

  test('should get artist', async () => {
    vi.spyOn(statisticsService, 'artist').mockReturnValue(
      of(formattedArtistMock)
    )

    expect(
      await firstValueFrom(statisticsController.artist('awd', '123'))
    ).toEqual(formattedArtistMock)
  })

  test('should get analysis', async () => {
    vi.spyOn(statisticsService, 'analysis').mockReturnValue(of(analysisMock))

    expect(await firstValueFrom(statisticsController.analysis('awd'))).toEqual(
      analysisMock
    )
  })
})
