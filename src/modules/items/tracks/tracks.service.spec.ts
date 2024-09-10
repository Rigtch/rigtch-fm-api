import { Test, TestingModule } from '@nestjs/testing'
import { DataSource, EntityManager, In } from 'typeorm'
import { MockInstance } from 'vitest'
import { MockProxy } from 'vitest-mock-extended'

import { Track } from './track.entity'
import { TracksService } from './tracks.service'

import {
  albumEntityMock,
  artistEntitiesMock,
  artistsMock,
  entityManagerFactoryMock,
  sdkArtistsMock,
  sdkCreateTrackMock,
  sdkCreateTracksMock,
  sdkSimplifiedAlbumMock,
  sdkSimplifiedArtistsMock,
  sdkSimplifiedTrackMock,
  sdkTrackMock,
  trackEntitiesMock,
  trackEntityMock,
  transactionFactoryMock,
} from '@common/mocks'
import {
  EntityManagerCreateMockInstance,
  GetItemsMockInstance,
} from '@common/types/mocks'
import { SdkArtist, SdkTrack } from '@common/types/spotify'
import { Album } from '@modules/items/albums'
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
          provide: DataSource,
          useValue: {
            transaction: transactionFactoryMock(entityManagerMock),
          },
        },
        {
          provide: ArtistsService,
          useValue: {
            updateOrCreate: vi.fn(),
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

  describe('updateOrCreate', () => {
    describe('updateOrCreateOne', () => {
      let findOneBySpy: MockInstance

      beforeEach(() => {
        findOneBySpy = vi.spyOn(entityManagerMock, 'findOneBy')
      })

      test('should update track if found', async () => {
        findOneBySpy.mockResolvedValue(trackEntityMock)

        expect(await tracksService.updateOrCreate(sdkCreateTrackMock)).toEqual(
          trackEntityMock
        )
        expect(findOneBySpy).toHaveBeenCalledWith(Track, {
          externalId: sdkTrackMock.id,
        })
      })

      test('should create track if not found', async () => {
        findOneBySpy
          .mockResolvedValueOnce(null)
          .mockResolvedValue(albumEntityMock)
        const findBySpy = vi
          .spyOn(entityManagerMock, 'findBy')
          .mockResolvedValue(artistEntitiesMock)
        const createSpy = (
          vi.spyOn(
            entityManagerMock,
            'create'
          ) as EntityManagerCreateMockInstance
        ).mockReturnValue(trackEntityMock)
        const saveSpy = vi
          .spyOn(entityManagerMock, 'save')
          .mockResolvedValue(trackEntityMock)

        expect(await tracksService.updateOrCreate(sdkCreateTrackMock)).toEqual(
          trackEntityMock
        )
        expect(createSpy).toHaveBeenCalledWith(Track, {
          name: sdkTrackMock.name,
          externalId: sdkTrackMock.id,
          href: sdkTrackMock.external_urls.spotify,
          duration: sdkTrackMock.duration_ms,
          trackNumber: sdkTrackMock.track_number,
          discNumber: sdkTrackMock.disc_number,
          explicit: sdkTrackMock.explicit,
          album: albumEntityMock,
          artists: artistEntitiesMock,
        })
        expect(saveSpy).toHaveBeenCalledWith(trackEntityMock)
        expect(findOneBySpy).toHaveBeenCalledWith(Track, {
          externalId: sdkTrackMock.id,
        })
        expect(findOneBySpy).toHaveBeenCalledWith(Album, {
          externalId: sdkTrackMock.album.id,
        })
        expect(findOneBySpy).toHaveBeenCalledTimes(2)
        expect(findBySpy).toHaveBeenCalledWith(Artist, {
          externalId: In(
            artistEntitiesMock.map(({ externalId }) => externalId)
          ),
        })
      })
    })

    describe('updateOrCreateMany', () => {
      test('should update or create many tracks', async () => {
        const updateOrCreateOneSpy = vi
          .spyOn(tracksService as never, 'updateOrCreateOne')
          .mockResolvedValue(trackEntityMock)

        expect(await tracksService.updateOrCreate(sdkCreateTracksMock)).toEqual(
          trackEntitiesMock
        )
        expect(updateOrCreateOneSpy).toHaveBeenCalledWith(sdkCreateTrackMock)
        expect(updateOrCreateOneSpy).toHaveBeenCalledTimes(5)
      })
    })

    describe('updateOrCreateManyInTransaction', () => {
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
      const customArtistsMock = artistsMock
        .slice(0, 3)
        .map((artist, index) => ({
          externalId: tracksExternalIds[index],
          ...artist,
        }))

      let sdkTracksMock: MockProxy<SdkTrack>[]
      let tracksMock: MockProxy<Track>[]

      let findBySpy: MockInstance
      let createSpy: MockInstance
      let saveSpy: MockInstance
      let artistsUpdateOrCreateSpy: MockInstance
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
        artistsUpdateOrCreateSpy = vi.spyOn(artistsService, 'updateOrCreate')
        getSpotifyArtistsSpy = vi.spyOn(spotifyService.artists, 'get')
      })

      test('should find all tracks and does not create any', async () => {
        findBySpy.mockResolvedValue(tracksMock)

        expect(
          await tracksService.updateOrCreate(
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
        expect(artistsUpdateOrCreateSpy).not.toHaveBeenCalled()
      })

      test('should not find any tracks and create all', async () => {
        findBySpy.mockResolvedValueOnce([]).mockResolvedValue(customArtistsMock)
        createSpy.mockImplementation((_, { externalId }) =>
          tracksMock.find(track => track.externalId === externalId)
        )
        saveSpy.mockResolvedValue(tracksMock)

        expect(
          await tracksService.updateOrCreate(
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
        expect(artistsUpdateOrCreateSpy).not.toHaveBeenCalled()
      })

      test('should not find any tracks and create all with some artists', async () => {
        findBySpy
          .mockResolvedValueOnce([])
          .mockResolvedValue([customArtistsMock[0], customArtistsMock[1]])
        getSpotifyArtistsSpy.mockResolvedValue([customSdkArtistsMock[2]])
        artistsUpdateOrCreateSpy.mockResolvedValue([customArtistsMock[2]])
        createSpy.mockImplementation((_, { externalId }) =>
          tracksMock.find(track => track.externalId === externalId)
        )
        saveSpy.mockResolvedValue(tracksMock)

        expect(
          await tracksService.updateOrCreate(
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
        expect(artistsUpdateOrCreateSpy).toHaveBeenCalledWith(
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
          await tracksService.updateOrCreate(
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
        expect(artistsUpdateOrCreateSpy).not.toHaveBeenCalled()
        expect(createSpy).toHaveBeenCalledWith(Track, expect.anything())
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(saveSpy).toHaveBeenCalledWith([tracksMock[2]])
      })
    })
  })
})
