import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { UsersRepository } from '../users.repository'

import { UsersProfileController } from './users-profile.controller'

import { TimeRange } from '@modules/spotify/users/enums'
import {
  recentlyPlayedTracksPageMockFactory,
  tracksMock,
  topGenresMock,
  pageMockFactory,
  analysisMock,
  accessTokenMock,
  userMock,
  sdkArtistsMock,
  artistEntitiesMock,
  sdkTracksMock,
  trackEntitiesMock,
} from '@common/mocks'
import { SpotifyService } from '@modules/spotify'
import { ItemsService } from '@modules/items'
import { Track } from '@modules/items/tracks'
import { SdkTrack } from '@common/types/spotify'

type FindOrCreateTracksSpy = MockInstance<
  [tracks: SdkTrack[]],
  Promise<Track[]>
>

describe('UsersProfileController', () => {
  const limit = 10
  const before = 12_873
  const after = 945_384
  const offset = 0
  const timeRange = TimeRange.MEDIUM_TERM

  let moduleRef: TestingModule
  let usersProfileController: UsersProfileController
  let spotifyService: SpotifyService
  let itemsService: ItemsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        UsersProfileController,
        {
          provide: UsersRepository,
          useValue: {
            find: vi.fn(),
            findOneBy: vi.fn(),
            findOneByDisplayName: vi.fn(),
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
            player: {
              getRecentlyPlayedTracks: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    usersProfileController = moduleRef.get(UsersProfileController)
    spotifyService = moduleRef.get(SpotifyService)
    itemsService = moduleRef.get(ItemsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(usersProfileController).toBeDefined()
  })

  describe('getProfile', () => {
    test("should get user's profile", () => {
      expect(usersProfileController.getProfile(userMock)).toEqual(
        userMock.profile
      )
    })
  })

  describe('getRecentlyPlayedTracks', () => {
    let getRecentlyPlayedTracksSpy: MockInstance

    beforeEach(() => {
      getRecentlyPlayedTracksSpy = vi
        .spyOn(spotifyService.player, 'getRecentlyPlayedTracks')
        .mockResolvedValue(recentlyPlayedTracksPageMockFactory(tracksMock))
    })

    test("should get user's recently played tracks", async () => {
      expect(
        await usersProfileController.getRecentlyPlayed(accessTokenMock, {})
      ).toEqual(recentlyPlayedTracksPageMockFactory(tracksMock))

      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        10,
        {}
      )
    })

    test("should get user's recently played tracks with query params", async () => {
      expect(
        await usersProfileController.getRecentlyPlayed(accessTokenMock, {
          limit,
          before,
          after,
        })
      ).toEqual(recentlyPlayedTracksPageMockFactory(tracksMock))

      expect(getRecentlyPlayedTracksSpy).toHaveBeenCalledWith(
        accessTokenMock,
        limit,
        { before, after }
      )
    })
  })

  describe('getTopArtists', () => {
    let getTopArtistsSpy: MockInstance
    let findOrCreateSpy: MockInstance

    beforeEach(() => {
      getTopArtistsSpy = vi
        .spyOn(spotifyService.users, 'getTopArtists')
        .mockResolvedValue(pageMockFactory(sdkArtistsMock))
      findOrCreateSpy = vi
        .spyOn(itemsService, 'findOrCreate')
        .mockResolvedValue(artistEntitiesMock)
    })

    test('should get user top artists', async () => {
      expect(
        await usersProfileController.getTopArtists(accessTokenMock, {})
      ).toEqual(artistEntitiesMock)

      expect(getTopArtistsSpy).toHaveBeenCalledWith(accessTokenMock, {}, false)
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkArtistsMock)
    })

    test('should get user top artists with query', async () => {
      expect(
        await usersProfileController.getTopArtists(accessTokenMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(artistEntitiesMock)

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
        await usersProfileController.getTopTracks(accessTokenMock, {})
      ).toEqual(trackEntitiesMock)

      expect(getTopTracksSpy).toHaveBeenCalledWith(accessTokenMock, {}, false)
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkTracksMock)
    })

    test('should get user top tracks with query', async () => {
      expect(
        await usersProfileController.getTopTracks(accessTokenMock, {
          limit,
          timeRange,
          offset,
        })
      ).toEqual(trackEntitiesMock)

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
        await usersProfileController.getTopGenres(accessTokenMock, {})
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
        await usersProfileController.getTopGenres(accessTokenMock, {
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
      expect(await usersProfileController.getAnalysis(accessTokenMock)).toEqual(
        analysisMock
      )

      expect(getAnalysisSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })
})
