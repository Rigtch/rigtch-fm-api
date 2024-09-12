import { Test, TestingModule } from '@nestjs/testing'
import { Page } from '@spotify/web-api-ts-sdk'
import { EntityManager, In } from 'typeorm'
import { MockInstance } from 'vitest'

import { Album } from './album.entity'
import { AlbumsService } from './albums.service'
import { SdkCreateAlbum } from './dtos'

import {
  albumEntityMock,
  artistEntitiesMock,
  entityManagerFactoryMock,
  imagesMock,
  sdkArtistsMock,
  sdkImagesMock,
  sdkSimplifiedAlbumMock,
  sdkSimplifiedArtistsMock,
  sdkTracksMock,
  trackEntitiesMock,
} from '@common/mocks'
import { SdkTrack } from '@common/types/spotify'
import { ArtistsService } from '@modules/items/artists'
import { ImagesService } from '@modules/items/images'
import { TracksService } from '@modules/items/tracks'
import { SpotifyService } from '@modules/spotify'

describe('AlbumsService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let albumsService: AlbumsService
  let tracksService: TracksService
  let artistsService: ArtistsService
  let imagesService: ImagesService
  let spotifyService: SpotifyService

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: TracksService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
        {
          provide: ArtistsService,
          useValue: {
            findOrCreate: vi.fn(),
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
            artists: {
              get: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    albumsService = moduleRef.get(AlbumsService)
    tracksService = moduleRef.get(TracksService)
    artistsService = moduleRef.get(ArtistsService)
    imagesService = moduleRef.get(ImagesService)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  describe('findOrCreate', () => {
    const albumsExternalIds = ['id1', 'id2', 'id3']

    let sdkAlbumsMock: SdkCreateAlbum[]
    let albumsMock: Album[]

    let findBySpy: MockInstance
    let createSpy: MockInstance
    let saveSpy: MockInstance
    let artistsFindOrCreateSpy: MockInstance
    let imagesFindOrCreateSpy: MockInstance
    let tracksFindOrCreateSpy: MockInstance
    let spotifyGetArtistsSpy: MockInstance

    beforeEach(() => {
      sdkAlbumsMock = Array.from({ length: 3 }, (_, index) => ({
        ...sdkSimplifiedAlbumMock,
        id: albumsExternalIds[index],
        images: sdkImagesMock,
        artists: sdkSimplifiedArtistsMock,
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
      artistsFindOrCreateSpy = vi.spyOn(artistsService, 'findOrCreate')
      imagesFindOrCreateSpy = vi.spyOn(imagesService, 'findOrCreate')
      tracksFindOrCreateSpy = vi.spyOn(tracksService, 'findOrCreate')
      spotifyGetArtistsSpy = vi.spyOn(spotifyService.artists, 'get')
    })

    test('should find all albums and does not create any', async () => {
      findBySpy.mockResolvedValue(albumsMock)

      expect(
        await albumsService.findOrCreate(sdkAlbumsMock, entityManagerMock)
      ).toEqual(albumsMock)

      expect(findBySpy).toHaveBeenCalledWith(Album, {
        externalId: In(albumsExternalIds),
      })
      expect(createSpy).not.toHaveBeenCalled()
      expect(saveSpy).not.toHaveBeenCalled()
      expect(artistsFindOrCreateSpy).not.toHaveBeenCalled()
      expect(imagesFindOrCreateSpy).not.toHaveBeenCalled()
      expect(tracksFindOrCreateSpy).not.toHaveBeenCalled()
    })

    test('should not find any albums and create all', async () => {
      findBySpy.mockResolvedValueOnce([])
      createSpy.mockImplementation((_, { externalId }) =>
        albumsMock.find(album => album.externalId === externalId)
      )
      saveSpy.mockImplementation(({ externalId }) =>
        albumsMock.find(album => album.externalId === externalId)
      )
      spotifyGetArtistsSpy.mockResolvedValue(sdkArtistsMock)
      artistsFindOrCreateSpy.mockResolvedValue(artistEntitiesMock)
      imagesFindOrCreateSpy.mockResolvedValue(imagesMock)
      tracksFindOrCreateSpy.mockResolvedValue(trackEntitiesMock)

      expect(
        await albumsService.findOrCreate(sdkAlbumsMock, entityManagerMock)
      ).toEqual(albumsMock)

      expect(findBySpy).toHaveBeenCalledWith(Album, {
        externalId: In(albumsExternalIds),
      })
      expect(createSpy).toHaveBeenCalledWith(Album, expect.anything())
      expect(createSpy).toHaveBeenCalledTimes(3)
      expect(saveSpy).toHaveBeenCalledWith(expect.anything())
      expect(saveSpy).toHaveBeenCalledTimes(6)
      expect(spotifyGetArtistsSpy).toHaveBeenCalledWith(
        sdkArtistsMock.map(({ id }) => id),
        false
      )
      expect(spotifyGetArtistsSpy).toHaveBeenCalledTimes(3)
      expect(artistsFindOrCreateSpy).toHaveBeenCalledWith(
        sdkArtistsMock,
        entityManagerMock
      )
      expect(artistsFindOrCreateSpy).toHaveBeenCalledTimes(3)
      expect(imagesFindOrCreateSpy).toHaveBeenCalledWith(
        sdkImagesMock,
        entityManagerMock
      )
      expect(imagesFindOrCreateSpy).toHaveBeenCalledTimes(3)
      expect(tracksFindOrCreateSpy).toHaveBeenCalledWith(
        sdkTracksMock,
        entityManagerMock,
        albumsMock[2]
      )
      expect(tracksFindOrCreateSpy).toHaveBeenCalledTimes(3)
    })

    test('should find some albums and create the rest', async () => {
      const foundAlbumsMock = [albumsMock[0], albumsMock[1]]

      findBySpy.mockResolvedValueOnce(foundAlbumsMock)
      createSpy.mockImplementation((_, { externalId }) =>
        albumsMock.find(album => album.externalId === externalId)
      )
      saveSpy.mockResolvedValue(albumsMock[2])
      spotifyGetArtistsSpy.mockResolvedValue(sdkArtistsMock)

      expect(
        await albumsService.findOrCreate(sdkAlbumsMock, entityManagerMock)
      ).toEqual(albumsMock)

      expect(findBySpy).toHaveBeenCalledWith(Album, {
        externalId: In(albumsExternalIds),
      })
      expect(createSpy).toHaveBeenCalledWith(Album, expect.anything())
      expect(createSpy).toHaveBeenCalledTimes(1)
      expect(saveSpy).toHaveBeenCalledWith(albumsMock[2])
      expect(spotifyGetArtistsSpy).toHaveBeenCalledWith(
        sdkArtistsMock.map(({ id }) => id),
        false
      )
      expect(spotifyGetArtistsSpy).toHaveBeenCalledTimes(1)
      expect(artistsFindOrCreateSpy).toHaveBeenCalledWith(
        sdkArtistsMock,
        entityManagerMock
      )
      expect(artistsFindOrCreateSpy).toHaveBeenCalledTimes(1)
      expect(imagesFindOrCreateSpy).toHaveBeenCalledWith(
        sdkImagesMock,
        entityManagerMock
      )
      expect(imagesFindOrCreateSpy).toHaveBeenCalledTimes(1)
      expect(tracksFindOrCreateSpy).toHaveBeenCalledWith(
        sdkTracksMock,
        entityManagerMock,
        albumsMock[2]
      )
      expect(tracksFindOrCreateSpy).toHaveBeenCalledTimes(1)
    })
  })
})
