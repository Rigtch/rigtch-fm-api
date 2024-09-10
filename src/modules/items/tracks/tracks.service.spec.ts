import { Test, type TestingModule } from '@nestjs/testing'
import { type EntityManager, In } from 'typeorm'
import { type MockInstance } from 'vitest'

import { Track } from './track.entity'
import { TracksService } from './tracks.service'

import {
  albumEntityMock,
  artistsMock,
  entityManagerFactoryMock,
  sdkArtistsMock,
  sdkSimplifiedAlbumMock,
  sdkSimplifiedArtistsMock,
  sdkSimplifiedTrackMock,
} from '@common/mocks'
import type { GetItemsMockInstance } from '@common/types/mocks'
import type { SdkArtist, SdkTrack } from '@common/types/spotify'
import { Artist, ArtistsService } from '@modules/items/artists'
import { SpotifyService } from '@modules/spotify'

describe('TracksService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let tracksService: TracksService
  let artistsService: ArtistsService
  let spotifyService: SpotifyService

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        TracksService,
        {
          provide: ArtistsService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            artists: {
              get: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    tracksService = moduleRef.get(TracksService)
    artistsService = moduleRef.get(ArtistsService)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tracksService).toBeDefined()
  })

  describe('findOrCreate', () => {
    const tracksExternalIds = ['id1', 'id2', 'id3']
    const customSdkSimplifiedArtistsMock = sdkSimplifiedArtistsMock
      .slice(0, 3)
      .map((artist, index) => ({
        ...artist,
        id: tracksExternalIds[index],
      }))
    const customSdkArtistsMock = sdkArtistsMock
      .slice(0, 3)
      .map((artist, index) => ({
        ...artist,
        id: tracksExternalIds[index],
      }))
    const customArtistsMock = artistsMock.slice(0, 3).map((artist, index) => ({
      externalId: tracksExternalIds[index],
      ...artist,
    }))

    let sdkTracksMock: SdkTrack[]
    let tracksMock: Track[]

    let findBySpy: MockInstance
    let createSpy: MockInstance
    let saveSpy: MockInstance
    let artistsFindOrCreateSpy: MockInstance
    let getSpotifyArtistsSpy: GetItemsMockInstance<SdkArtist>

    beforeEach(() => {
      sdkTracksMock = Array.from(
        { length: 3 },
        (_, index) =>
          ({
            ...sdkSimplifiedTrackMock,
            id: tracksExternalIds[index],
            artists: customSdkSimplifiedArtistsMock,
            album: sdkSimplifiedAlbumMock,
          }) as SdkTrack
      )
      tracksMock = Array.from(
        { length: 3 },
        (_, index) =>
          ({
            externalId: tracksExternalIds[index],
            artists: customArtistsMock,
            album: albumEntityMock,
          }) as Track
      )

      findBySpy = vi.spyOn(entityManagerMock, 'findBy')
      createSpy = vi.spyOn(entityManagerMock, 'create')
      saveSpy = vi.spyOn(entityManagerMock, 'save')
      artistsFindOrCreateSpy = vi.spyOn(artistsService, 'findOrCreate')
      getSpotifyArtistsSpy = vi.spyOn(spotifyService.artists, 'get')
    })

    test('should find all tracks and does not create any', async () => {
      findBySpy.mockResolvedValue(tracksMock)

      expect(
        await tracksService.findOrCreate(
          sdkTracksMock,
          entityManagerMock,
          albumEntityMock
        )
      ).toEqual(tracksMock)

      expect(findBySpy).toHaveBeenCalledWith(Track, {
        externalId: In(tracksExternalIds),
      })
      expect(findBySpy).toHaveBeenCalledTimes(1)
      expect(createSpy).not.toHaveBeenCalled()
      expect(saveSpy).not.toHaveBeenCalled()
      expect(artistsFindOrCreateSpy).not.toHaveBeenCalled()
    })

    test('should not find any tracks and create all', async () => {
      findBySpy.mockResolvedValueOnce([]).mockResolvedValue(customArtistsMock)
      createSpy.mockImplementation((_, { externalId }) =>
        tracksMock.find(track => track.externalId === externalId)
      )
      saveSpy.mockResolvedValue(tracksMock)

      expect(
        await tracksService.findOrCreate(
          sdkTracksMock,
          entityManagerMock,
          albumEntityMock
        )
      ).toEqual(tracksMock)

      expect(findBySpy).toHaveBeenCalledWith(Track, {
        externalId: In(tracksExternalIds),
      })
      expect(findBySpy).toHaveBeenCalledWith(Artist, {
        externalId: In(tracksExternalIds),
      })
      expect(createSpy).toHaveBeenCalledWith(Track, expect.anything())
      expect(createSpy).toHaveBeenCalledTimes(3)
      expect(saveSpy).toHaveBeenCalledWith(tracksMock)
      expect(artistsFindOrCreateSpy).not.toHaveBeenCalled()
    })

    test('should not find any tracks and create all with some artists', async () => {
      findBySpy
        .mockResolvedValueOnce([])
        .mockResolvedValue([customArtistsMock[0], customArtistsMock[1]])
      getSpotifyArtistsSpy.mockResolvedValue([customSdkArtistsMock[2]])
      artistsFindOrCreateSpy.mockResolvedValue([customArtistsMock[2]])
      createSpy.mockImplementation((_, { externalId }) =>
        tracksMock.find(track => track.externalId === externalId)
      )
      saveSpy.mockResolvedValue(tracksMock)

      expect(
        await tracksService.findOrCreate(
          sdkTracksMock,
          entityManagerMock,
          albumEntityMock
        )
      ).toEqual(tracksMock)

      expect(findBySpy).toHaveBeenCalledWith(Track, {
        externalId: In(tracksExternalIds),
      })
      expect(findBySpy).toHaveBeenCalledWith(Artist, {
        externalId: In(tracksExternalIds),
      })
      expect(getSpotifyArtistsSpy).toHaveBeenCalledWith(
        tracksExternalIds.slice(2, 3),
        false
      )
      expect(artistsFindOrCreateSpy).toHaveBeenCalledWith(
        customSdkArtistsMock.slice(2, 3),
        entityManagerMock
      )
      expect(createSpy).toHaveBeenCalledWith(Track, expect.anything())
      expect(createSpy).toHaveBeenCalledTimes(3)
      expect(saveSpy).toHaveBeenCalledWith(tracksMock)
    })

    test('should find some tracks and create the rest', async () => {
      findBySpy
        .mockResolvedValueOnce([tracksMock[0], tracksMock[1]])
        .mockResolvedValue(customArtistsMock)
      createSpy.mockImplementation((_, { externalId }) =>
        tracksMock.find(track => track.externalId === externalId)
      )
      saveSpy.mockResolvedValue([tracksMock[2]])

      expect(
        await tracksService.findOrCreate(
          sdkTracksMock,
          entityManagerMock,
          albumEntityMock
        )
      ).toEqual(tracksMock)

      expect(findBySpy).toHaveBeenCalledWith(Track, {
        externalId: In(tracksExternalIds),
      })
      expect(findBySpy).toHaveBeenCalledWith(Artist, {
        externalId: In(tracksExternalIds),
      })
      expect(getSpotifyArtistsSpy).not.toHaveBeenCalled()
      expect(artistsFindOrCreateSpy).not.toHaveBeenCalled()
      expect(createSpy).toHaveBeenCalledWith(Track, expect.anything())
      expect(createSpy).toHaveBeenCalledTimes(1)
      expect(saveSpy).toHaveBeenCalledWith([tracksMock[2]])
    })
  })
})
