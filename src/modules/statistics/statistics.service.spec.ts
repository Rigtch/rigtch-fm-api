import { HttpService } from '@nestjs/axios'
import { TestingModule, Test } from '@nestjs/testing'
import { firstValueFrom, of } from 'rxjs'

import { StatisticsService } from './statistics.service'

import { AdapterService } from '@modules/adapter'
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
} from '@common/mocks'
import { axiosResponseMockFactory } from '~/utils'

describe('StatisticsService', () => {
  let statisticsService: StatisticsService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        AdapterService,
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
    jest.spyOn(httpService, 'get').mockReturnValue(
      of(
        axiosResponseMockFactory({
          items: Array.from({ length: 5 }).map(() => ({
            track: spotifyTrackMock,
            played_at: '2022-11-26T11:01:10.040Z',
          })),
        })
      )
    )

    expect(await firstValueFrom(statisticsService.lastTracks('awd'))).toEqual(
      formattedTracksMock
    )
  })

  it('should get top artists', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(
        of(axiosResponseMockFactory({ items: spotifyArtistsMock }))
      )

    expect(await firstValueFrom(statisticsService.topArtists('awd'))).toEqual(
      formattedArtistsMock
    )
  })

  it('should get top genres', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(
      of(
        axiosResponseMockFactory({
          items: spotifyArtistsMock,
        })
      )
    )

    expect(await firstValueFrom(statisticsService.topGenres('awd', 3))).toEqual(
      topGenresMock
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

    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of(axiosResponseMockFactory(spotifyTracksMock)))

    expect(await firstValueFrom(statisticsService.topTracks('awd'))).toEqual(
      formattedTracksMock
    )
  })

  it('should get artist with given id', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of(axiosResponseMockFactory(spotifyArtistMock)))

    expect(
      await firstValueFrom(statisticsService.artist('awd', 'some id'))
    ).toEqual(formattedArtistMock)
  })

  it('should generate analysis', async () => {
    jest
      .spyOn(statisticsService, 'topTracks')
      .mockReturnValue(of(formattedTracksMock))

    jest.spyOn(httpService, 'get').mockReturnValue(
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
