import { Test, type TestingModule } from '@nestjs/testing'
import { Page } from '@spotify/web-api-ts-sdk'
import { DataSource, In, type EntityManager } from 'typeorm'
import type { MockInstance } from 'vitest'

import { Album, AlbumsService } from './albums'
import { ArtistsService } from './artists'
import { ItemsService } from './items.service'
import { Track, tracksRelations } from './tracks'

import {
  albumEntityMock,
  artistEntitiesMock,
  entityManagerFactoryMock,
  imagesMock,
  sdkArtistsMock,
  sdkImagesMock,
  sdkSimplifiedAlbumMock,
  sdkTrackMock,
  sdkTracksMock,
  trackEntitiesMock,
  trackEntityMock,
  transactionFactoryMock,
} from '@common/mocks'
import type { GetItemsMockInstance } from '@common/types/mocks'
import type {
  SdkAlbum,
  SdkSimplifiedAlbum,
  SdkTrack,
} from '@common/types/spotify'
import { SpotifyService } from '@modules/spotify'

describe('ItemsService', () => {
  let moduleRef: TestingModule
  let itemsService: ItemsService
  let albumsService: AlbumsService
  let artistsService: ArtistsService
  let spotifyService: SpotifyService

  let entityManagerMock: EntityManager

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: AlbumsService,
          useValue: {
            updateOrCreate: vi.fn(),
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
            albums: {
              get: vi.fn(),
            },
            artists: {
              get: vi.fn(),
            },
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: transactionFactoryMock(entityManagerMock),
          },
        },
      ],
    }).compile()

    itemsService = moduleRef.get(ItemsService)
    albumsService = moduleRef.get(AlbumsService)
    artistsService = moduleRef.get(ArtistsService)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(itemsService).toBeDefined()
  })

  describe('findOrCreate', () => {
    test('should return empty array if tracks are empty', async () => {
      expect(await itemsService.findOrCreate([])).toEqual([])
    })

    describe('findOrCreateArtists', () => {
      test('should find or create artists', async () => {
        const artistsUpdateOrCreateSpy = vi
          .spyOn(artistsService, 'updateOrCreate')
          .mockResolvedValue(artistEntitiesMock)

        expect(await itemsService.findOrCreate(sdkArtistsMock)).toEqual(
          artistEntitiesMock
        )

        expect(artistsUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkArtistsMock,
          entityManagerMock
        )
      })
    })

    describe('findOrCreateTracks', () => {
      const externalIds = ['id1', 'id2', 'id3']

      let sdkAlbumsMock: SdkAlbum[]
      let albumsMock: Album[]
      let sdkTracksMock: SdkTrack[]
      let tracksMock: Track[]

      let findBySpy: MockInstance
      let findSpy: MockInstance
      let getAlbumsSpy: GetItemsMockInstance<SdkAlbum>
      let albumsUpdateOrCreateSpy: MockInstance

      beforeEach(() => {
        sdkAlbumsMock = Array.from({ length: 3 }, (_, index) => ({
          ...sdkSimplifiedAlbumMock,
          id: externalIds[index],
          images: sdkImagesMock,
          artists: sdkArtistsMock,
          tracks: {
            items: sdkTracksMock,
          } as Page<SdkTrack>,
        }))
        albumsMock = Array.from({ length: 3 }, (_, index) => ({
          ...albumEntityMock,
          externalId: externalIds[index],
          images: imagesMock,
          artists: artistEntitiesMock,
          tracks: trackEntitiesMock,
        }))
        sdkTracksMock = Array.from({ length: 3 }, (_, index) => ({
          ...sdkTrackMock,
          id: externalIds[index],
          album: sdkAlbumsMock[0] as unknown as SdkSimplifiedAlbum,
          artists: sdkArtistsMock,
        }))
        tracksMock = Array.from({ length: 3 }, (_, index) => ({
          ...trackEntityMock,
          externalId: externalIds[index],
          album: albumsMock[0],
          artists: artistEntitiesMock,
        }))

        findBySpy = vi.spyOn(entityManagerMock, 'findBy')
        findSpy = vi.spyOn(entityManagerMock, 'find')
        getAlbumsSpy = vi.spyOn(spotifyService.albums, 'get')
        albumsUpdateOrCreateSpy = vi.spyOn(albumsService, 'updateOrCreate')
      })

      describe('Same album', () => {
        test('should find all tracks and does not create any', async () => {
          findBySpy.mockResolvedValue([albumsMock[0]])
          findSpy.mockResolvedValue(tracksMock)

          expect(await itemsService.findOrCreate(sdkTracksMock)).toEqual(
            tracksMock
          )

          expect(findBySpy).toHaveBeenCalledWith(Album, {
            externalId: In([albumsMock[0].externalId]),
          })
          expect(findSpy).toHaveBeenCalledWith(Track, {
            where: {
              externalId: In(externalIds),
            },
            relations: tracksRelations,
          })
          expect(getAlbumsSpy).not.toHaveBeenCalled()
          expect(albumsUpdateOrCreateSpy).not.toHaveBeenCalled()
        })

        test('should not find any tracks and create all', async () => {
          findBySpy.mockResolvedValueOnce([])
          findSpy.mockResolvedValueOnce(tracksMock)
          getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
          albumsUpdateOrCreateSpy.mockResolvedValue(albumsMock)

          expect(await itemsService.findOrCreate(sdkTracksMock)).toEqual(
            tracksMock
          )

          expect(findBySpy).toHaveBeenCalledWith(Album, {
            externalId: In([albumsMock[0].externalId]),
          })
          expect(findSpy).toHaveBeenCalledWith(Track, {
            where: {
              externalId: In(externalIds),
            },
            relations: tracksRelations,
          })
          expect(getAlbumsSpy).toHaveBeenCalledWith(
            [sdkAlbumsMock[0].id],
            false
          )
          expect(albumsUpdateOrCreateSpy).toHaveBeenCalledWith(
            sdkAlbumsMock,
            entityManagerMock
          )
        })
      })

      describe('Different albums', () => {
        beforeEach(() => {
          sdkTracksMock[0].album =
            sdkAlbumsMock[0] as unknown as SdkSimplifiedAlbum
          sdkTracksMock[1].album =
            sdkAlbumsMock[1] as unknown as SdkSimplifiedAlbum
          sdkTracksMock[2].album =
            sdkAlbumsMock[2] as unknown as SdkSimplifiedAlbum
          tracksMock[0].album = albumsMock[0]
          tracksMock[1].album = albumsMock[1]
          tracksMock[2].album = albumsMock[2]
        })

        test('should find all tracks and create all', async () => {
          findBySpy.mockResolvedValue(albumsMock)
          findSpy.mockResolvedValue(tracksMock)

          expect(await itemsService.findOrCreate(sdkTracksMock)).toEqual(
            tracksMock
          )

          expect(findBySpy).toHaveBeenCalledWith(Album, {
            externalId: In(externalIds),
          })
          expect(findSpy).toHaveBeenCalledWith(Track, {
            where: {
              externalId: In(externalIds),
            },
            relations: tracksRelations,
          })
          expect(getAlbumsSpy).not.toHaveBeenCalled()
          expect(albumsUpdateOrCreateSpy).not.toHaveBeenCalled()
        })

        test('should not find any tracks and create all', async () => {
          findBySpy.mockResolvedValueOnce([])
          findSpy.mockResolvedValueOnce(tracksMock)
          getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
          albumsUpdateOrCreateSpy.mockResolvedValue(albumsMock)

          expect(await itemsService.findOrCreate(sdkTracksMock)).toEqual(
            tracksMock
          )

          expect(findBySpy).toHaveBeenCalledWith(Album, {
            externalId: In(externalIds),
          })
          expect(findSpy).toHaveBeenCalledWith(Track, {
            where: {
              externalId: In(externalIds),
            },
            relations: tracksRelations,
          })
          expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
          expect(albumsUpdateOrCreateSpy).toHaveBeenCalledWith(
            sdkAlbumsMock,
            entityManagerMock
          )
        })

        test('should find some tracks and create the rest', async () => {
          const foundAlbums = [albumsMock[0], albumsMock[1]]

          findBySpy.mockResolvedValueOnce(foundAlbums)
          findSpy.mockResolvedValueOnce(tracksMock)
          getAlbumsSpy.mockResolvedValue(sdkAlbumsMock.slice(2))
          albumsUpdateOrCreateSpy.mockResolvedValue(albumsMock.slice(2))

          expect(await itemsService.findOrCreate(sdkTracksMock)).toEqual(
            tracksMock
          )

          expect(findBySpy).toHaveBeenCalledWith(Album, {
            externalId: In(externalIds),
          })
          expect(findSpy).toHaveBeenCalledWith(Track, {
            where: {
              externalId: In(externalIds),
            },
            relations: tracksRelations,
          })
          expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds.slice(2), false)
          expect(albumsUpdateOrCreateSpy).toHaveBeenCalledWith(
            sdkAlbumsMock.slice(2),
            entityManagerMock
          )
        })
      })
    })

    describe('findOrCreateAlbums', () => {
      const albumsExternalIds = ['id1', 'id2', 'id3']

      let sdkAlbumsMock: SdkAlbum[]
      let albumsMock: Album[]

      let findBySpy: MockInstance
      let getAlbumsSpy: GetItemsMockInstance<SdkAlbum>
      let albumsUpdateOrCreateSpy: MockInstance

      beforeEach(() => {
        sdkAlbumsMock = Array.from({ length: 3 }, (_, index) => ({
          ...sdkSimplifiedAlbumMock,
          id: albumsExternalIds[index],
          images: sdkImagesMock,
          artists: sdkArtistsMock,
          tracks: {
            items: sdkTracksMock,
          } as Page<SdkTrack>,
        }))
        albumsMock = Array.from({ length: 3 }, (_, index) => ({
          ...albumEntityMock,
          externalId: albumsExternalIds[index],
          images: imagesMock,
          artists: artistEntitiesMock,
          tracks: trackEntitiesMock,
        }))

        findBySpy = vi.spyOn(entityManagerMock, 'findBy')
        getAlbumsSpy = vi.spyOn(spotifyService.albums, 'get')
        albumsUpdateOrCreateSpy = vi.spyOn(albumsService, 'updateOrCreate')
      })

      test('should find all albums and does not create any', async () => {
        findBySpy.mockResolvedValue(albumsMock)

        expect(
          await itemsService.findOrCreate(
            sdkAlbumsMock as unknown as SdkSimplifiedAlbum[]
          )
        ).toEqual(albumsMock)

        expect(findBySpy).toHaveBeenCalledWith(Album, {
          externalId: In(albumsExternalIds),
        })
        expect(getAlbumsSpy).not.toHaveBeenCalled()
        expect(albumsUpdateOrCreateSpy).not.toHaveBeenCalled()
      })

      test('should not find any albums and create all', async () => {
        findBySpy.mockResolvedValueOnce([])
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
        albumsUpdateOrCreateSpy.mockResolvedValue(albumsMock)

        expect(
          await itemsService.findOrCreate(
            sdkAlbumsMock as unknown as SdkSimplifiedAlbum[]
          )
        ).toEqual(albumsMock)

        expect(findBySpy).toHaveBeenCalledWith(Album, {
          externalId: In(albumsExternalIds),
        })
        expect(getAlbumsSpy).toHaveBeenCalledWith(albumsExternalIds, false)
        expect(albumsUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkAlbumsMock,
          entityManagerMock
        )
        expect(albumsUpdateOrCreateSpy).toHaveBeenCalledTimes(1)
      })

      test('should find some albums and create the rest', async () => {
        const foundAlbumsMock = [albumsMock[0], albumsMock[1]]

        findBySpy.mockResolvedValueOnce(foundAlbumsMock)
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock.slice(2))
        albumsUpdateOrCreateSpy.mockResolvedValue(albumsMock.slice(2))

        expect(
          await itemsService.findOrCreate(
            sdkAlbumsMock as unknown as SdkSimplifiedAlbum[]
          )
        ).toEqual(albumsMock)

        expect(findBySpy).toHaveBeenCalledWith(Album, {
          externalId: In(albumsExternalIds),
        })
        expect(getAlbumsSpy).toHaveBeenCalledWith(
          albumsExternalIds.slice(2),
          false
        )
        expect(albumsUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkAlbumsMock.slice(2),
          entityManagerMock
        )
        expect(albumsUpdateOrCreateSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
