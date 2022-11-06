import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { formattedArtistsMock } from './mocks/formatted-artist.mock'
import { formattedTracksMock } from './mocks/formatted-track.mock'
import { StatisticsService } from './statistics.service'
import { StatisticsResolver } from './statistics.resolver'

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

  it('should get last tracks', async () => {
    statisticsService.getLastTracks = jest
      .fn()
      .mockReturnValue(of(formattedTracksMock))

    expect(await statisticsResolver.getLastTracks('awd')).toEqual(
      formattedTracksMock
    )
  })

  it('should get top artists', async () => {
    statisticsService.getTopArtists = jest
      .fn()
      .mockReturnValue(of(formattedArtistsMock))

    expect(await statisticsResolver.getTopArtists('awd')).toEqual(
      formattedArtistsMock
    )
  })

  it('should get top tracks', async () => {
    statisticsService.getTopTracks = jest
      .fn()
      .mockReturnValue(of(formattedTracksMock))

    expect(await statisticsResolver.getTopTracks('awd')).toEqual(
      formattedTracksMock
    )
  })
})
