import { test, describe, expect, beforeEach, vi } from 'vitest'
import { HttpService } from '@nestjs/axios'
import { TestingModule, Test } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { StatisticsService } from './statistics.service'

import {
  spotifyTrackMock,
  formattedTracksMock,
  spotifyArtistsMock,
  formattedArtistsMock,
  topGenresMock,
  spotifyTracksMock,
  spotifyArtistMock,
  formattedArtistMock,
  spotifyAudioFeaturesMock,
  analysisMock,
  spotifyResponseMockFactory,
  spotifyResponseWithOffsetMockFactory,
  spotifyResponseWithCursorsMockFactory,
} from '@common/mocks'
import { axiosResponseMockFactory } from '~/utils'

describe('StatisticsService', () => {
  let statisticsService: StatisticsService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,

        {
          provide: HttpService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    statisticsService = module.get<StatisticsService>(StatisticsService)
    httpService = module.get<HttpService>(HttpService)
  })

  test('should be defined', () => {
    expect(statisticsService).toBeDefined()
  })

  test('should get last tracks', async () => {
    vi.spyOn(httpService, 'get').mockReturnValue(
      of(
        axiosResponseMockFactory(
          spotifyResponseWithCursorsMockFactory(
            Array.from({ length: 5 }).map(() => ({
              track: spotifyTrackMock,
              played_at: '2022-11-26T11:01:10.040Z',
            }))
          )
        )
      )
    )

    expect(await firstValueFrom(statisticsService.lastTracks('awd'))).toEqual(
      spotifyResponseWithCursorsMockFactory(formattedTracksMock)
    )
  })

  test('should get top artists', async () => {
    vi.spyOn(httpService, 'get').mockReturnValue(
      of(
        axiosResponseMockFactory(
          spotifyResponseWithOffsetMockFactory(spotifyArtistsMock)
        )
      )
    )

    expect(await firstValueFrom(statisticsService.topArtists('awd'))).toEqual(
      spotifyResponseWithOffsetMockFactory(formattedArtistsMock)
    )
  })

  test('should get top genres', async () => {
    vi.spyOn(httpService, 'get').mockReturnValue(
      of(
        axiosResponseMockFactory(spotifyResponseMockFactory(spotifyArtistsMock))
      )
    )

    expect(await firstValueFrom(statisticsService.topGenres('awd', 3))).toEqual(
      topGenresMock
    )
  })

  test('should get top tracks', async () => {
    vi.spyOn(httpService, 'get').mockReturnValue(
      of(
        axiosResponseMockFactory(
          spotifyResponseWithOffsetMockFactory(spotifyTracksMock)
        )
      )
    )

    expect(await firstValueFrom(statisticsService.topTracks('awd'))).toEqual(
      spotifyResponseWithOffsetMockFactory(formattedTracksMock)
    )
  })

  test('should get artist with given id', async () => {
    vi.spyOn(httpService, 'get').mockReturnValue(
      of(axiosResponseMockFactory(spotifyArtistMock))
    )

    expect(
      await firstValueFrom(statisticsService.artist('awd', 'some id'))
    ).toEqual(formattedArtistMock)
  })

  test('should generate analysis', async () => {
    vi.spyOn(statisticsService, 'topTracks').mockReturnValue(
      of(spotifyResponseWithOffsetMockFactory(formattedTracksMock))
    )

    vi.spyOn(httpService, 'get').mockReturnValue(
      of(
        axiosResponseMockFactory({
          audio_features: [spotifyAudioFeaturesMock],
        })
      )
    )

    expect(await firstValueFrom(statisticsService.analysis('awd'))).toEqual(
      analysisMock
    )
  })
})
