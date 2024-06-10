import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { ItemsService } from './items.service'
import { AlbumsRepository, AlbumsService } from './albums'
import { ArtistsRepository, ArtistsService } from './artists'
import { TracksRepository, TracksService } from './tracks'

import { ImagesService } from '@modules/items/images'
import {
  albumEntityMock,
  albumsEntitiesMock,
  artistEntitiesMock,
  sdkAlbumMock,
  sdkAlbumsMock,
  sdkArtistMock,
  sdkArtistsMock,
  sdkSimplifiedAlbumsMock,
  sdkSimplifiedTracksMock,
  sdkTrackMock,
  sdkTracksMock,
  trackEntitiesMock,
} from '@common/mocks'
import { SdkAlbum } from '@common/types/spotify'
import { GetItemsMockInstance } from '@common/types/mocks'
import { SpotifyService } from '@modules/spotify'

describe('ItemsService', () => {
  let moduleRef: TestingModule
  let itemsService: ItemsService
  let albumsService: AlbumsService
  let albumsRepository: AlbumsRepository
  let artistsService: ArtistsService
  let artistsRepository: ArtistsRepository
  let tracksService: TracksService
  let tracksRepository: TracksRepository
  let imagesService: ImagesService
  let spotifyService: SpotifyService

  beforeEach(async () => {
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
          provide: AlbumsRepository,
          useValue: {
            findAlbumsByExternalIds: vi.fn(),
            find: vi.fn(),
            save: vi.fn(),
          },
        },
        {
          provide: ArtistsService,
          useValue: {
            updateOrCreate: vi.fn(),
          },
        },
        {
          provide: ArtistsRepository,
          useValue: {
            findArtistsByExternalIds: vi.fn(),
          },
        },
        {
          provide: TracksService,
          useValue: {
            updateOrCreate: vi.fn(),
          },
        },
        {
          provide: TracksRepository,
          useValue: {
            findTracksByExternalIds: vi.fn(),
          },
        },
        {
          provide: ImagesService,
          useValue: {
            findOrCreate: vi.fn(),
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
      ],
    }).compile()

    itemsService = moduleRef.get(ItemsService)
    albumsService = moduleRef.get(AlbumsService)
    albumsRepository = moduleRef.get(AlbumsRepository)
    artistsService = moduleRef.get(ArtistsService)
    artistsRepository = moduleRef.get(ArtistsRepository)
    tracksService = moduleRef.get(TracksService)
    tracksRepository = moduleRef.get(TracksRepository)
    imagesService = moduleRef.get(ImagesService)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(itemsService).toBeDefined()
  })

  describe('findOrCreate', () => {
    let findArtistsByExternalIdsSpy: MockInstance
    let getArtistsSpy: MockInstance
    let imagesFindOrCreate: MockInstance
    let artistsUpdateOrCreate: MockInstance

    beforeEach(() => {
      findArtistsByExternalIdsSpy = vi.spyOn(
        artistsRepository,
        'findArtistsByExternalIds'
      )
      getArtistsSpy = vi.spyOn(spotifyService.artists, 'get')
      imagesFindOrCreate = vi.spyOn(imagesService, 'findOrCreate')
      artistsUpdateOrCreate = vi.spyOn(artistsService, 'updateOrCreate')
    })

    test('should return empty array if tracks are empty', async () => {
      expect(await itemsService.findOrCreate([])).toEqual([])
    })

    describe('findOrCreateArtists', () => {
      test('should find and return artists', async () => {
        findArtistsByExternalIdsSpy.mockResolvedValue(artistEntitiesMock)
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)
        artistsUpdateOrCreate.mockResolvedValue(artistEntitiesMock)

        expect(await itemsService.findOrCreate(sdkArtistsMock)).toEqual(
          artistEntitiesMock
        )

        expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkArtistMock.id,
        ])
        expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
        expect(artistsUpdateOrCreate).toHaveBeenCalledWith([])
      })

      test('should create and return artists', async () => {
        findArtistsByExternalIdsSpy
          .mockResolvedValueOnce([])
          .mockResolvedValue(artistEntitiesMock)
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)
        artistsUpdateOrCreate.mockResolvedValue(artistEntitiesMock)

        expect(await itemsService.findOrCreate(sdkArtistsMock)).toEqual(
          artistEntitiesMock
        )

        expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkArtistMock.id,
        ])
        expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
        expect(artistsUpdateOrCreate).toHaveBeenCalledWith(sdkArtistsMock)
      })
    })

    describe('findOrCreateTracks', () => {
      let findAlbumsByExternalIdsSpy: MockInstance
      let getAlbumsSpy: GetItemsMockInstance<SdkAlbum>
      let albumsUpdateOrCreate: MockInstance
      let findTracksByExternalIdsSpy: MockInstance

      beforeEach(() => {
        findAlbumsByExternalIdsSpy = vi.spyOn(
          albumsRepository,
          'findAlbumsByExternalIds'
        )
        getAlbumsSpy = vi.spyOn(
          spotifyService.albums,
          'get'
        ) as unknown as GetItemsMockInstance<SdkAlbum>
        albumsUpdateOrCreate = vi.spyOn(albumsService, 'updateOrCreate')
        findTracksByExternalIdsSpy = vi.spyOn(
          tracksRepository,
          'findTracksByExternalIds'
        )
      })

      test('should find images, artists, albums and return tracks', async () => {
        findArtistsByExternalIdsSpy.mockResolvedValue(artistEntitiesMock)
        findAlbumsByExternalIdsSpy.mockResolvedValue(albumsEntitiesMock)
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
        findTracksByExternalIdsSpy.mockResolvedValue(trackEntitiesMock)

        expect(await itemsService.findOrCreate(sdkTracksMock)).toEqual(
          trackEntitiesMock
        )
        expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkArtistMock.id,
        ])
        expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkAlbumMock.id,
        ])
        expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
        expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
        expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith([
          sdkTrackMock.id,
        ])
        expect(imagesFindOrCreate).not.toHaveBeenCalled()
        expect(artistsUpdateOrCreate).not.toHaveBeenCalled()
        expect(albumsUpdateOrCreate).not.toHaveBeenCalled()
      })

      test('should find artists, create images, albums and return tracks', async () => {
        findArtistsByExternalIdsSpy.mockResolvedValue(artistEntitiesMock)
        findAlbumsByExternalIdsSpy.mockResolvedValue([])
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
        findTracksByExternalIdsSpy.mockResolvedValue(trackEntitiesMock)

        expect(await itemsService.findOrCreate(sdkTracksMock)).toEqual(
          trackEntitiesMock
        )

        expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkArtistMock.id,
        ])
        expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkAlbumMock.id,
        ])
        expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
        expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
        expect(imagesFindOrCreate).toHaveBeenCalledWith(
          sdkArtistsMock.flatMap(({ images }) => images)
        )
        expect(artistsUpdateOrCreate).not.toHaveBeenCalled()
        expect(albumsUpdateOrCreate).toHaveBeenCalledWith(sdkAlbumsMock)
        expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith([
          sdkTrackMock.id,
        ])
      })

      test('should create images, artists, albums and return tracks', async () => {
        findArtistsByExternalIdsSpy.mockResolvedValue([])
        findAlbumsByExternalIdsSpy.mockResolvedValue([])
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
        findTracksByExternalIdsSpy.mockResolvedValue(trackEntitiesMock)

        expect(await itemsService.findOrCreate(sdkTracksMock)).toEqual(
          trackEntitiesMock
        )

        expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkArtistMock.id,
        ])
        expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkAlbumMock.id,
        ])
        expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
        expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
        expect(imagesFindOrCreate).toHaveBeenCalledWith([
          ...sdkArtistsMock.flatMap(({ images }) => images),
          ...sdkAlbumsMock.flatMap(({ images }) => images),
        ])
        expect(artistsUpdateOrCreate).toHaveBeenCalledWith(sdkArtistsMock)
        expect(albumsUpdateOrCreate).toHaveBeenCalledWith(sdkAlbumsMock)
        expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith([
          sdkTrackMock.id,
        ])
      })

      test('should create missing tracks in albums', async () => {
        findAlbumsByExternalIdsSpy.mockResolvedValue([
          {
            ...albumEntityMock,
            tracks: [],
          },
        ])
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)
        findArtistsByExternalIdsSpy.mockResolvedValue(artistEntitiesMock)

        const tracksUpdateOrCreateSpy = vi
          .spyOn(tracksService, 'updateOrCreate')
          .mockResolvedValue(trackEntitiesMock)

        const albumsSaveSpy = vi.spyOn(albumsRepository, 'save')

        await itemsService.findOrCreate(sdkTracksMock)

        expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkAlbumMock.id,
        ])
        expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
        expect(albumsSaveSpy).toHaveBeenCalledWith({
          ...albumEntityMock,
          tracks: trackEntitiesMock,
        })
        expect(tracksUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkSimplifiedTracksMock.map(track => ({
            ...track,
            album: sdkAlbumMock,
          }))
        )
      })
    })

    describe('findOrCreateAlbums', () => {
      let findAlbumsByExternalIdsSpy: MockInstance
      let findSpy: MockInstance
      let getAlbumsSpy: GetItemsMockInstance<SdkAlbum>
      let albumsUpdateOrCreate: MockInstance

      beforeEach(() => {
        findAlbumsByExternalIdsSpy = vi.spyOn(
          albumsRepository,
          'findAlbumsByExternalIds'
        )
        findSpy = vi.spyOn(albumsRepository, 'find')
        getAlbumsSpy = vi.spyOn(
          spotifyService.albums,
          'get'
        ) as unknown as GetItemsMockInstance<SdkAlbum>
        albumsUpdateOrCreate = vi.spyOn(albumsService, 'updateOrCreate')
      })

      test('should find images, artists, albums and return albums', async () => {
        findArtistsByExternalIdsSpy.mockResolvedValue(artistEntitiesMock)
        findSpy.mockResolvedValue(albumsEntitiesMock)
        findAlbumsByExternalIdsSpy.mockResolvedValue(albumsEntitiesMock)
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)

        expect(
          await itemsService.findOrCreate(sdkSimplifiedAlbumsMock)
        ).toEqual(albumsEntitiesMock)
        expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkArtistMock.id,
        ])
        expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkAlbumMock.id,
        ])
        expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
        expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
        expect(albumsUpdateOrCreate).not.toHaveBeenCalledWith()
      })

      test('should create images, artists, albums and return albums', async () => {
        findArtistsByExternalIdsSpy.mockResolvedValue([])
        findAlbumsByExternalIdsSpy.mockResolvedValue([])
        findSpy.mockResolvedValue(albumsEntitiesMock)
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)

        expect(
          await itemsService.findOrCreate(sdkSimplifiedAlbumsMock)
        ).toEqual(albumsEntitiesMock)

        expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkArtistMock.id,
        ])
        expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkAlbumMock.id,
        ])
        expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
        expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
        expect(albumsUpdateOrCreate).toHaveBeenCalledWith(sdkAlbumsMock)
      })

      test('should create missing tracks in albums', async () => {
        findAlbumsByExternalIdsSpy.mockResolvedValue([
          {
            ...albumEntityMock,
            tracks: [],
          },
        ])
        getAlbumsSpy.mockResolvedValue(sdkAlbumsMock)
        getArtistsSpy.mockResolvedValue(sdkArtistsMock)
        findArtistsByExternalIdsSpy.mockResolvedValue(artistEntitiesMock)

        const tracksUpdateOrCreateSpy = vi
          .spyOn(tracksService, 'updateOrCreate')
          .mockResolvedValue(trackEntitiesMock)

        const albumsSaveSpy = vi.spyOn(albumsRepository, 'save')

        await itemsService.findOrCreate(sdkSimplifiedAlbumsMock)

        expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([
          sdkAlbumMock.id,
        ])
        expect(albumsSaveSpy).toHaveBeenCalledWith({
          ...albumEntityMock,
          tracks: trackEntitiesMock,
        })
        expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
        expect(tracksUpdateOrCreateSpy).toHaveBeenCalledWith(
          sdkSimplifiedTracksMock.map(track => ({
            ...track,
            album: sdkAlbumMock,
          }))
        )
      })
    })
  })
})
