import { Test, TestingModule } from '@nestjs/testing'
import type { MockInstance } from 'vitest'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { StatsSpotifyController } from './stats-spotify.controller'

import {
  accessTokenMock,
  analysisMock,
  artistEntitiesMock,
  pageMockFactory,
  sdkArtistsMock,
  sdkTracksMock,
  topGenresMock,
  trackEntitiesMock,
} from '@common/mocks'
import {
  FindOrCreateArtistsSpy,
  FindOrCreateTracksSpy,
} from '@common/types/mocks'
import { ItemsService } from '@modules/items'
import { SpotifyService } from '@modules/spotify'
import { TimeRange } from '@modules/spotify/users/enums'
import { UsersRepository } from '@modules/users'

describe('UsersProfileController', () => {
  const limit = 10
  const offset = 0
  const timeRange = TimeRange.MEDIUM_TERM

  let moduleRef: TestingModule
  let statsSpotifyController: StatsSpotifyController
  let spotifyService: SpotifyService
  let itemsService: ItemsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        StatsSpotifyController,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
        {
          provide: ItemsService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            users: {
              getTopArtists: vi.fn(),
              getTopTracks: vi.fn(),
              getTopGenres: vi.fn(),
              getAnalysis: vi.fn(),
            },
          },
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: vi.fn(),
      })
      .compile()

    statsSpotifyController = moduleRef.get(StatsSpotifyController)
    spotifyService = moduleRef.get(SpotifyService)
    itemsService = moduleRef.get(ItemsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(statsSpotifyController).toBeDefined()
  })

  describe('getTopArtists', () => {
    let getTopArtistsSpy: MockInstance
    let findOrCreateSpy: FindOrCreateArtistsSpy

    beforeEach(() => {
      getTopArtistsSpy = vi
        .spyOn(spotifyService.users, 'getTopArtists')
        .mockResolvedValue(pageMockFactory(sdkArtistsMock))
      findOrCreateSpy = (
        vi.spyOn(
          itemsService,
          'findOrCreate'
        ) as unknown as FindOrCreateArtistsSpy
      ).mockResolvedValue(artistEntitiesMock)
    })

    test('should get user top artists', async () => {
      expect(
        await statsSpotifyController.getTopArtists(accessTokenMock, {})
      ).toEqual(pageMockFactory(artistEntitiesMock))

      expect(getTopArtistsSpy).toHaveBeenCalledWith(accessTokenMock, {}, false)
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkArtistsMock)
    })

    test('should get user top artists with query', async () => {
      expect(
        await statsSpotifyController.getTopArtists(accessTokenMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(pageMockFactory(artistEntitiesMock))

      expect(getTopArtistsSpy).toHaveBeenCalledWith(
        accessTokenMock,
        {
          limit,
          timeRange,
          offset,
        },
        false
      )
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkArtistsMock)
    })
  })

  describe('getTopTracks', () => {
    let getTopTracksSpy: MockInstance
    let findOrCreateSpy: FindOrCreateTracksSpy

    beforeEach(() => {
      getTopTracksSpy = vi
        .spyOn(spotifyService.users, 'getTopTracks')
        .mockResolvedValue(pageMockFactory(sdkTracksMock))
      findOrCreateSpy = (
        vi.spyOn(
          itemsService,
          'findOrCreate'
        ) as unknown as FindOrCreateTracksSpy
      ).mockResolvedValue(trackEntitiesMock)
    })

    test('should get user top tracks', async () => {
      expect(
        await statsSpotifyController.getTopTracks(accessTokenMock, {})
      ).toEqual(pageMockFactory(trackEntitiesMock))

      expect(getTopTracksSpy).toHaveBeenCalledWith(accessTokenMock, {}, false)
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkTracksMock)
    })

    test('should get user top tracks with query', async () => {
      expect(
        await statsSpotifyController.getTopTracks(accessTokenMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(pageMockFactory(trackEntitiesMock))

      expect(getTopTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        {
          limit,
          timeRange,
          offset,
        },
        false
      )
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkTracksMock)
    })
  })

  describe('getTopGenres', () => {
    let getTopGenresSpy: MockInstance

    beforeEach(() => {
      getTopGenresSpy = vi
        .spyOn(spotifyService.users, 'getTopGenres')
        .mockResolvedValue(topGenresMock)
    })

    test('should get user top genres', async () => {
      expect(
        await statsSpotifyController.getTopGenres(accessTokenMock, {})
      ).toEqual(topGenresMock)

      expect(getTopGenresSpy).toHaveBeenCalledWith(
        accessTokenMock,
        undefined,
        undefined,
        undefined
      )
    })

    test('should get user top genres with query', async () => {
      expect(
        await statsSpotifyController.getTopGenres(accessTokenMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(topGenresMock)

      expect(getTopGenresSpy).toHaveBeenCalledWith(
        accessTokenMock,
        timeRange,
        limit,
        offset
      )
    })
  })

  describe('getAnalysis', () => {
    let getAnalysisSpy: MockInstance

    beforeEach(() => {
      getAnalysisSpy = vi
        .spyOn(spotifyService.users, 'getAnalysis')
        .mockResolvedValue(analysisMock)
    })

    test('should get user analysis', async () => {
      expect(await statsSpotifyController.getAnalysis(accessTokenMock)).toEqual(
        analysisMock
      )

      expect(getAnalysisSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })
})
