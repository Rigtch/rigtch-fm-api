import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { StatisticsService } from './statistics.service'
import { StatisticsResolver } from './statistics.resolver'

import {
  formattedArtistMock,
  formattedArtistsMock,
  formattedTrackMock,
  formattedTracksMock,
  topGenresArrayMock,
  topGenresMock,
} from '@lib/common'

const mockArrayFactory = (mock: any, length: number) =>
  Array.from({ length }, () => mock)

describe('StatisticsResolver', () => {
  let statisticsResolver: StatisticsResolver
  let statisticsService: StatisticsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsResolver,
        {
          provide: StatisticsService,
          useValue: {
            lastTracks: jest.fn(),
            topArtists: jest.fn(),
            topTracks: jest.fn(),
            topGenres: jest.fn(),
          },
        },
      ],
    }).compile()

    statisticsResolver = module.get<StatisticsResolver>(StatisticsResolver)
    statisticsService = module.get<StatisticsService>(StatisticsService)
  })

  it('should be defined', () => {
    expect(statisticsResolver).toBeDefined()
  })

  describe('TopTracks', () => {
    it('should query last tracks', async () => {
      statisticsService.lastTracks = jest
        .fn()
        .mockReturnValue(of(formattedTracksMock))

      expect(await statisticsResolver.lastTracks('awd', {})).toEqual(
        formattedTracksMock
      )
    })

    it('should query last tracks with limit argument', async () => {
      const limit = 20

      statisticsService.lastTracks = jest
        .fn()
        .mockImplementation((accessToken, limit) =>
          of(mockArrayFactory(formattedTrackMock, limit))
        )

      const result = await statisticsResolver.lastTracks('awd', { limit })

      expect(result.length).toEqual(limit)
    })
  })

  describe('topGenres', () => {
    it('should query top genres', async () => {
      statisticsService.topGenres = jest.fn().mockReturnValue(of(topGenresMock))

      expect(await statisticsResolver.topGenres('awd', {})).toEqual(
        topGenresMock
      )
    })

    it('should query top genres with limit argument', async () => {
      const limit = 2

      statisticsService.topGenres = jest
        .fn()
        .mockImplementation((accessToken, limit) =>
          of({
            genres: mockArrayFactory(topGenresArrayMock, limit),
          })
        )

      const result = await statisticsResolver.topGenres('awd', { limit })

      expect(result.genres.length).toEqual(limit)
    })
  })

  describe('topArtists', () => {
    it('should query top artists', async () => {
      statisticsService.topArtists = jest
        .fn()
        .mockReturnValue(of(formattedArtistsMock))

      expect(await statisticsResolver.topArtists('awd', {})).toEqual(
        formattedArtistsMock
      )
    })

    it('should query top artists with limit argument', async () => {
      const limit = 20

      statisticsService.topTracks = jest
        .fn()
        .mockImplementation((accessToken, limit) =>
          of(mockArrayFactory(formattedArtistMock, limit))
        )

      const result = await statisticsResolver.topTracks('awd', { limit })

      expect(result.length).toEqual(limit)
    })
  })

  describe('topTracks', () => {
    it('should query top tracks', async () => {
      statisticsService.topTracks = jest
        .fn()
        .mockReturnValue(of(formattedTracksMock))

      expect(await statisticsResolver.topTracks('awd', {})).toEqual(
        formattedTracksMock
      )
    })

    it('should query top tracks with limit argument', async () => {
      const limit = 20

      statisticsService.topTracks = jest
        .fn()
        .mockImplementation((accessToken, limit) =>
          of(mockArrayFactory(formattedTrackMock, limit))
        )

      const result = await statisticsResolver.topTracks('awd', { limit })

      expect(result.length).toEqual(limit)
    })
  })

  it('should get artist with given id', async () => {
    statisticsService.artist = jest
      .fn()
      .mockReturnValue(of(formattedArtistMock))

    expect(await statisticsResolver.artist('awd', { id: 'some id' })).toEqual(
      formattedArtistMock
    )
  })
})
