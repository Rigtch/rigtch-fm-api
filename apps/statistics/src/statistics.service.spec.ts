import { HttpService } from '@nestjs/axios'
import { TestingModule, Test } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { StatisticsService } from './statistics.service'

import {
  spotifyTrackMock,
  spotifyTracksMock,
  formattedArtistsMock,
  formattedTracksMock,
  spotifyArtistsMock,
  SpotifyService,
} from '@lib/common'

describe('StatisticsService', () => {
  let statisticsService: StatisticsService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        SpotifyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    statisticsService = module.get<StatisticsService>(StatisticsService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should be defined', () => {
    expect(statisticsService).toBeDefined()
  })

  it('should get last tracks', async () => {
    httpService.get = jest.fn().mockReturnValue(
      of({
        data: {
          items: Array.from({ length: 5 }).map(() => ({
            track: spotifyTrackMock,
            played_at: '2022-11-26T11:01:10.040Z',
          })),
        },
      })
    )

    expect(await firstValueFrom(statisticsService.lastTracks('awd'))).toEqual(
      formattedTracksMock
    )
  })

  it('should get top artists', async () => {
    httpService.get = jest.fn().mockReturnValueOnce(
      of({
        data: {
          items: spotifyArtistsMock,
        },
      })
    )

    expect(await firstValueFrom(statisticsService.topArtists('awd'))).toEqual(
      formattedArtistsMock
    )
  })

  it('should get top tracks', async () => {
    httpService.get = jest.fn().mockReturnValueOnce(
      of({
        data: {
          items: spotifyTracksMock,
        },
      })
    )

    expect(await firstValueFrom(statisticsService.topTracks('awd'))).toEqual(
      formattedTracksMock
    )
  })
})
