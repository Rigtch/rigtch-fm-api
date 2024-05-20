import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { ItemsService } from './items.service'
import { AlbumsRepository, AlbumsService } from './albums'
import { ArtistsRepository, ArtistsService } from './artists'
import { TracksRepository } from './tracks'

import { ImagesService } from '@modules/items/images'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import { SpotifyArtistsService } from '@modules/spotify/artists'
import {
  albumsEntitiesMock,
  artistEntitiesMock,
  sdkAlbumMock,
  sdkAlbumsMock,
  sdkArtistMock,
  sdkArtistsMock,
  sdkTrackMock,
  sdkTracksMock,
  trackEntitiesMock,
} from '@common/mocks'
import { SdkAlbum } from '@common/types/spotify'
import { GetItemsMockInstance } from '@common/types/mocks'

describe('ItemsService', () => {
  let moduleRef: TestingModule
  let itemsService: ItemsService
  let albumsService: AlbumsService
  let albumsRepository: AlbumsRepository
  let artistsService: ArtistsService
  let artistsRepository: ArtistsRepository
  let tracksRepository: TracksRepository
  let imagesService: ImagesService
  let spotifyAlbumsService: SpotifyAlbumsService
  let spotifyArtistsService: SpotifyArtistsService

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
          provide: SpotifyAlbumsService,
          useValue: {
            getAlbums: vi.fn(),
          },
        },
        {
          provide: SpotifyArtistsService,
          useValue: {
            getArtists: vi.fn(),
          },
        },
      ],
    }).compile()

    itemsService = moduleRef.get(ItemsService)
    albumsService = moduleRef.get(AlbumsService)
    albumsRepository = moduleRef.get(AlbumsRepository)
    artistsService = moduleRef.get(ArtistsService)
    artistsRepository = moduleRef.get(ArtistsRepository)
    tracksRepository = moduleRef.get(TracksRepository)
    imagesService = moduleRef.get(ImagesService)
    spotifyAlbumsService = moduleRef.get(SpotifyAlbumsService)
    spotifyArtistsService = moduleRef.get(SpotifyArtistsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(itemsService).toBeDefined()
  })

  describe('findOrCreate', () => {
    let findArtistsByExternalIdsSpy: MockInstance
    let findAlbumsByExternalIdsSpy: MockInstance
    let getArtistsSpy: MockInstance
    let getAlbumsSpy: GetItemsMockInstance<SdkAlbum>
    let imagesFindOrCreate: MockInstance
    let artistsUpdateOrCreate: MockInstance
    let albumsUpdateOrCreate: MockInstance
    let findTracksByExternalIdsSpy: MockInstance

    beforeEach(() => {
      findArtistsByExternalIdsSpy = vi.spyOn(
        artistsRepository,
        'findArtistsByExternalIds'
      )
      findAlbumsByExternalIdsSpy = vi.spyOn(
        albumsRepository,
        'findAlbumsByExternalIds'
      )
      getArtistsSpy = vi.spyOn(spotifyArtistsService, 'getArtists')
      getAlbumsSpy = vi.spyOn(
        spotifyAlbumsService,
        'getAlbums'
      ) as unknown as GetItemsMockInstance<SdkAlbum>
      imagesFindOrCreate = vi.spyOn(imagesService, 'findOrCreate')
      artistsUpdateOrCreate = vi.spyOn(artistsService, 'updateOrCreate')
      albumsUpdateOrCreate = vi.spyOn(albumsService, 'updateOrCreate')
      findTracksByExternalIdsSpy = vi.spyOn(
        tracksRepository,
        'findTracksByExternalIds'
      )
    })

    test('should return empty array if tracks are empty', async () => {
      expect(await itemsService.findOrCreate([])).toEqual([])
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
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([sdkAlbumMock.id])
      expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
      expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith([sdkTrackMock.id])
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
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([sdkAlbumMock.id])
      expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
      expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
      expect(imagesFindOrCreate).toHaveBeenCalledWith(
        sdkArtistsMock.flatMap(({ images }) => images)
      )
      expect(artistsUpdateOrCreate).not.toHaveBeenCalled()
      expect(albumsUpdateOrCreate).toHaveBeenCalledWith(sdkAlbumsMock)
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith([sdkTrackMock.id])
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
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith([sdkAlbumMock.id])
      expect(getArtistsSpy).toHaveBeenCalledWith([sdkArtistMock.id], false)
      expect(getAlbumsSpy).toHaveBeenCalledWith([sdkAlbumMock.id], false)
      expect(imagesFindOrCreate).toHaveBeenCalledWith([
        ...sdkArtistsMock.flatMap(({ images }) => images),
        ...sdkAlbumsMock.flatMap(({ images }) => images),
      ])
      expect(artistsUpdateOrCreate).toHaveBeenCalledWith(sdkArtistsMock)
      expect(albumsUpdateOrCreate).toHaveBeenCalledWith(sdkAlbumsMock)
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith([sdkTrackMock.id])
    })
  })
})
