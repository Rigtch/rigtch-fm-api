import { test, describe, expect, beforeEach, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

import {
  analysisMock,
  artistMock,
  artistsMock,
  trackMock,
  tracksMock,
  spotifyResponseWithCursorsMockFactory,
  spotifyResponseWithOffsetMockFactory,
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
        of(spotifyResponseWithCursorsMockFactory(tracksMock))
      )

      expect(
        await firstValueFrom(statisticsController.lastTracks('awd', {}))
      ).toEqual(spotifyResponseWithCursorsMockFactory(tracksMock))
    })

    test('should get last tracks with limit query', async () => {
      const limit = 20

      const formattedTracksWithLimitMock = Array.from(
        { length: limit },
        () => trackMock
      )

      vi.spyOn(statisticsService, 'lastTracks').mockReturnValue(
        of(spotifyResponseWithCursorsMockFactory(formattedTracksWithLimitMock))
      )

      expect(
        await firstValueFrom(statisticsController.lastTracks('awd', { limit }))
      ).toEqual(
        spotifyResponseWithCursorsMockFactory(formattedTracksWithLimitMock)
      )
    })
  })

  describe('TopTracks', () => {
    test('should get top tracks', async () => {
      vi.spyOn(statisticsService, 'topTracks').mockReturnValue(
        of(spotifyResponseWithOffsetMockFactory(tracksMock))
      )

      expect(
        await firstValueFrom(statisticsController.topTracks('awd', {}))
      ).toEqual(spotifyResponseWithOffsetMockFactory(tracksMock))
    })

    test('should get top tracks with limit query', async () => {
      const limit = 20

      const formattedTracksWithLimitMock = Array.from(
        { length: limit },
        () => trackMock
      )

      vi.spyOn(statisticsService, 'topTracks').mockReturnValue(
        of(spotifyResponseWithOffsetMockFactory(formattedTracksWithLimitMock))
      )

      expect(
        await firstValueFrom(statisticsController.topTracks('awd', { limit }))
      ).toEqual(
        spotifyResponseWithOffsetMockFactory(formattedTracksWithLimitMock)
      )
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
        of(spotifyResponseWithOffsetMockFactory(artistsMock))
      )

      expect(
        await firstValueFrom(statisticsController.topArtists('awd', {}))
      ).toEqual(spotifyResponseWithOffsetMockFactory(artistsMock))
    })

    test('should get top artists with limit argument', async () => {
      const limit = 20

      const formattedArtistsWithLimitMock = Array.from(
        { length: limit },
        () => artistMock
      )

      vi.spyOn(statisticsService, 'topArtists').mockReturnValue(
        of(spotifyResponseWithOffsetMockFactory(formattedArtistsWithLimitMock))
      )

      expect(
        await firstValueFrom(statisticsController.topArtists('awd', { limit }))
      ).toEqual(
        spotifyResponseWithOffsetMockFactory(formattedArtistsWithLimitMock)
      )
    })
  })

  test('should get artist', async () => {
    vi.spyOn(statisticsService, 'artist').mockReturnValue(of(artistMock))

    expect(
      await firstValueFrom(statisticsController.artist('awd', '123'))
    ).toEqual(artistMock)
  })

  test('should get analysis', async () => {
    vi.spyOn(statisticsService, 'analysis').mockReturnValue(of(analysisMock))

    expect(await firstValueFrom(statisticsController.analysis('awd'))).toEqual(
      analysisMock
    )
  })
})
