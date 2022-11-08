import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { formattedArtistMock } from './../../../libs/common/src/spotify/mocks/formatted-artist.mock'
import { StatisticsService } from './statistics.service'
import { StatisticsResolver } from './statistics.resolver'

import {
  formattedArtistsMock,
  formattedTrackMock,
  formattedTracksMock,
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
            getLastTracks: jest.fn(),
            getTopArtists: jest.fn(),
            getTopTracks: jest.fn(),
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
      statisticsService.getLastTracks = jest
        .fn()
        .mockReturnValue(of(formattedTracksMock))

      expect(await statisticsResolver.getLastTracks('awd')).toEqual(
        formattedTracksMock
      )
    })

    it('should query last tracks with limit argument', async () => {
      const limit = 20

      statisticsService.getLastTracks = jest
        .fn()
        .mockImplementation((accessToken, limit) =>
          of(mockArrayFactory(formattedTrackMock, limit))
        )

      const result = await statisticsResolver.getLastTracks('awd', limit)

      expect(result.length).toEqual(limit)
    })
  })

  describe('topArtists', () => {
    it('should query top artists', async () => {
      statisticsService.getTopArtists = jest
        .fn()
        .mockReturnValue(of(formattedArtistsMock))

      expect(await statisticsResolver.getTopArtists('awd')).toEqual(
        formattedArtistsMock
      )
    })

    it('should query top artists with limit argument', async () => {
      const limit = 20

      statisticsService.getTopTracks = jest
        .fn()
        .mockImplementation((accessToken, limit) =>
          of(mockArrayFactory(formattedArtistMock, limit))
        )

      const result = await statisticsResolver.getTopTracks('awd', limit)

      expect(result.length).toEqual(limit)
    })
  })

  describe('topTracks', () => {
    it('should query top tracks', async () => {
      statisticsService.getTopTracks = jest
        .fn()
        .mockReturnValue(of(formattedTracksMock))

      expect(await statisticsResolver.getTopTracks('awd')).toEqual(
        formattedTracksMock
      )
    })

    it('should query top tracks with limit argument', async () => {
      const limit = 20

      statisticsService.getTopTracks = jest
        .fn()
        .mockImplementation((accessToken, limit) =>
          of(mockArrayFactory(formattedTrackMock, limit))
        )

      const result = await statisticsResolver.getTopTracks('awd', limit)

      expect(result.length).toEqual(limit)
    })
  })
})
