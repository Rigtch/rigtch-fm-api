import { Test, TestingModule } from '@nestjs/testing'
import { Page } from '@spotify/web-api-ts-sdk'
import { DataSource, EntityManager, In, UpdateResult } from 'typeorm'
import { MockInstance } from 'vitest'
import { mock } from 'vitest-mock-extended'

import { Album } from './album.entity'
import { AlbumsService } from './albums.service'

import {
  albumEntityMock,
  albumsEntitiesMock,
  artistEntitiesMock,
  entityManagerFactoryMock,
  imagesMock,
  sdkAlbumMock,
  sdkAlbumsMock,
  sdkArtistsMock,
  sdkImagesMock,
  sdkSimplifiedAlbumMock,
  sdkTracksMock,
  trackEntitiesMock,
  transactionFactoryMock,
} from '@common/mocks'
import { EntityManagerCreateMockInstance } from '@common/types/mocks'
import { SdkAlbum, SdkTrack } from '@common/types/spotify'
import { Artist, ArtistsService } from '@modules/items/artists'
import { Image, ImagesService } from '@modules/items/images'
import { TracksService } from '@modules/items/tracks'

describe('AlbumsService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let albumsService: AlbumsService
  let tracksService: TracksService
  let artistsService: ArtistsService
  let imagesService: ImagesService

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: DataSource,
          useValue: {
            transaction: transactionFactoryMock(entityManagerMock),
          },
        },
        {
          provide: TracksService,
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
          provide: ImagesService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    albumsService = moduleRef.get(AlbumsService)
    tracksService = moduleRef.get(TracksService)
    artistsService = moduleRef.get(ArtistsService)
    imagesService = moduleRef.get(ImagesService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  describe('updateOrCreate', () => {
    describe('updateOrCreateOne', () => {
      let findOneBySpy: MockInstance
      let tracksUpdateOrCreate: MockInstance

      beforeEach(() => {
        findOneBySpy = vi.spyOn(entityManagerMock, 'findOneBy')
        tracksUpdateOrCreate = vi.spyOn(tracksService, 'updateOrCreate')
      })

      test('should update album if found', async () => {
        findOneBySpy.mockResolvedValue(albumEntityMock)
        const updateSpy = vi
          .spyOn(entityManagerMock, 'update')
          .mockResolvedValue(mock<UpdateResult>())

        expect(await albumsService.updateOrCreate(sdkAlbumMock)).toEqual(
          albumEntityMock
        )

        expect(findOneBySpy).toHaveBeenCalledWith(Album, {
          externalId: sdkAlbumMock.id,
        })
        expect(findOneBySpy).toHaveBeenCalledTimes(2)
        expect(updateSpy).toHaveBeenCalledWith(
          Album,
          { externalId: sdkAlbumMock.id },
          {
            name: sdkAlbumMock.name,
            externalId: sdkAlbumMock.id,
            href: sdkAlbumMock.external_urls.spotify,
            albumType: sdkAlbumMock.album_type,
            releaseDate: new Date(sdkAlbumMock.release_date),
            releaseDatePrecision: sdkAlbumMock.release_date_precision,
            label: sdkAlbumMock.label,
            copyrights: sdkAlbumMock.copyrights.map(({ text }) => text),
            genres: sdkAlbumMock.genres,
            totalTracks: sdkAlbumMock.total_tracks,
          }
        )
        expect(tracksUpdateOrCreate).toHaveBeenCalled()
      })

      test('should create album if not found', async () => {
        findOneBySpy.mockResolvedValue(null)
        const findBySpy = vi
          .spyOn(entityManagerMock, 'findBy')
          .mockResolvedValueOnce(imagesMock)
          .mockResolvedValueOnce(artistEntitiesMock)
        const createSpy = (
          vi.spyOn(
            entityManagerMock,
            'create'
          ) as EntityManagerCreateMockInstance
        ).mockReturnValue(albumEntityMock)
        const saveSpy = vi
          .spyOn(entityManagerMock, 'save')
          .mockResolvedValue(albumEntityMock)

        expect(await albumsService.updateOrCreate(sdkAlbumMock)).toEqual(
          albumEntityMock
        )

        expect(findOneBySpy).toHaveBeenCalledWith(Album, {
          externalId: sdkAlbumMock.id,
        })
        expect(findBySpy).toHaveBeenCalledWith(Artist, {
          externalId: In(sdkArtistsMock.map(({ id }) => id)),
        })
        expect(findBySpy).toHaveBeenCalledWith(Image, {
          url: In(imagesMock.map(({ url }) => url)),
        })
        expect(findBySpy).toHaveBeenCalledTimes(2)
        expect(createSpy).toHaveBeenCalledWith(Album, {
          name: sdkAlbumMock.name,
          externalId: sdkAlbumMock.id,
          href: sdkAlbumMock.external_urls.spotify,
          albumType: sdkAlbumMock.album_type,
          releaseDate: new Date(sdkAlbumMock.release_date),
          releaseDatePrecision: sdkAlbumMock.release_date_precision,
          totalTracks: sdkAlbumMock.total_tracks,
          label: sdkAlbumMock.label,
          copyrights: sdkAlbumMock.copyrights.map(({ text }) => text),
          genres: sdkAlbumMock.genres,
          images: imagesMock,
          artists: artistEntitiesMock,
        })
        expect(saveSpy).toHaveBeenCalled()
        expect(tracksUpdateOrCreate).toHaveBeenCalled()
      })
    })

    describe('updateOrCreateMany', () => {
      test('should update or create many albums', async () => {
        const updateOrCreateOneSpy = vi
          .spyOn(albumsService as never, 'updateOrCreateOne')
          .mockResolvedValue(albumEntityMock)

        expect(await albumsService.updateOrCreate(sdkAlbumsMock)).toEqual(
          albumsEntitiesMock
        )

        expect(updateOrCreateOneSpy).toHaveBeenCalledWith(sdkAlbumMock)
        expect(updateOrCreateOneSpy).toHaveBeenCalledTimes(5)
      })
    })

    describe('updateOrCreateManyInTransaction', () => {
      const albumsExternalIds = ['id1', 'id2', 'id3']

      let sdkAlbumsMock: SdkAlbum[]
      let albumsMock: Album[]

      let findBySpy: MockInstance
      let createSpy: MockInstance
      let saveSpy: MockInstance
      let artistsUpdateOrCreateSpy: MockInstance
      let imagesFindOrCreateSpy: MockInstance
      let tracksUpdateOrCreateSpy: MockInstance

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
        createSpy = vi.spyOn(entityManagerMock, 'create')
        saveSpy = vi.spyOn(entityManagerMock, 'save')
        artistsUpdateOrCreateSpy = vi.spyOn(artistsService, 'updateOrCreate')
        imagesFindOrCreateSpy = vi.spyOn(imagesService, 'findOrCreate')
        tracksUpdateOrCreateSpy = vi.spyOn(tracksService, 'updateOrCreate')
      })

      test('should find all albums and does not create any', async () => {
        findBySpy.mockResolvedValue(albumsMock)

        expect(
          await albumsService.updateOrCreate(sdkAlbumsMock, entityManagerMock)
        ).toEqual(albumsMock)

        expect(findBySpy).toHaveBeenCalledWith(Album, {
          externalId: In(albumsExternalIds),
        })
        expect(createSpy).not.toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
        expect(artistsUpdateOrCreateSpy).not.toHaveBeenCalled()
        expect(imagesFindOrCreateSpy).not.toHaveBeenCalled()
        expect(tracksUpdateOrCreateSpy).not.toHaveBeenCalled()
      })

      test('should not find any albums and create all', async () => {
        findBySpy.mockResolvedValueOnce([])
        createSpy.mockImplementation((_, { externalId }) =>
          albumsMock.find(album => album.externalId === externalId)
        )
        saveSpy.mockImplementation(({ externalId }) =>
          albumsMock.find(album => album.externalId === externalId)
        )
        artistsUpdateOrCreateSpy.mockResolvedValue(artistEntitiesMock)
        imagesFindOrCreateSpy.mockResolvedValue(imagesMock)
        tracksUpdateOrCreateSpy.mockResolvedValue(trackEntitiesMock)

        expect(
          await albumsService.updateOrCreate(sdkAlbumsMock, entityManagerMock)
        ).toEqual(albumsMock)

        expect(findBySpy).toHaveBeenCalledWith(Album, {
          externalId: In(albumsExternalIds),
        })
        expect(createSpy).toHaveBeenCalledWith(Album, expect.anything())
        expect(createSpy).toHaveBeenCalledTimes(3)
        expect(saveSpy).toHaveBeenCalledWith(expect.anything())
        expect(saveSpy).toHaveBeenCalledTimes(6)
        expect(artistsUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkArtistsMock,
          entityManagerMock
        )
        expect(artistsUpdateOrCreateSpy).toHaveBeenCalledTimes(3)
        expect(imagesFindOrCreateSpy).toHaveBeenCalledWith(
          sdkImagesMock,
          entityManagerMock
        )
        expect(imagesFindOrCreateSpy).toHaveBeenCalledTimes(3)
        expect(tracksUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkTracksMock,
          entityManagerMock,
          albumsMock[2]
        )
        expect(tracksUpdateOrCreateSpy).toHaveBeenCalledTimes(3)
      })

      test('should find some albums and create the rest', async () => {
        const foundAlbumsMock = [albumsMock[0], albumsMock[1]]

        findBySpy.mockResolvedValueOnce(foundAlbumsMock)
        createSpy.mockImplementation((_, { externalId }) =>
          albumsMock.find(album => album.externalId === externalId)
        )
        saveSpy.mockResolvedValue(albumsMock[2])

        expect(
          await albumsService.updateOrCreate(sdkAlbumsMock, entityManagerMock)
        ).toEqual(albumsMock)

        expect(findBySpy).toHaveBeenCalledWith(Album, {
          externalId: In(albumsExternalIds),
        })
        expect(createSpy).toHaveBeenCalledWith(Album, expect.anything())
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(saveSpy).toHaveBeenCalledWith(albumsMock[2])
        expect(artistsUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkArtistsMock,
          entityManagerMock
        )
        expect(artistsUpdateOrCreateSpy).toHaveBeenCalledTimes(1)
        expect(imagesFindOrCreateSpy).toHaveBeenCalledWith(
          sdkImagesMock,
          entityManagerMock
        )
        expect(imagesFindOrCreateSpy).toHaveBeenCalledTimes(1)
        expect(tracksUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkTracksMock,
          entityManagerMock,
          albumsMock[2]
        )
        expect(tracksUpdateOrCreateSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
