import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { AlbumsRepository } from './albums.repository'
import { AlbumsService } from './albums.service'

import { TracksService } from '@modules/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import {
  albumEntityMock,
  trackEntitiesMock,
  sdkAlbumMock,
  artistEntityMock,
  albumMock,
  imagesMock,
  artistEntitiesMock,
  sdkArtistsMock,
} from '@common/mocks'
import { SdkAlbum } from '@common/types/spotify'
import { ImagesService } from '@modules/images'
import { ArtistsService } from '@modules/artists'

type GetAlbumMockInstance = MockInstance<
  [id: string, adapt: false],
  Promise<SdkAlbum>
>
type GetAlbumsMockInstance = MockInstance<
  [ids: string[], adapt: false],
  Promise<SdkAlbum[]>
>

describe('AlbumsService', () => {
  const externalId = 'externalId'

  let moduleRef: TestingModule
  let albumsService: AlbumsService
  let albumsRepository: AlbumsRepository
  let tracksService: TracksService
  let artistsService: ArtistsService
  let imagesService: ImagesService
  let spotifyAlbumsService: SpotifyAlbumsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: AlbumsRepository,
          useValue: {
            findAlbumByExternalId: vi.fn(),
            createAlbum: vi.fn(),
            findAlbumsByExternalIds: vi.fn(),
            save: vi.fn(),
          },
        },
        {
          provide: TracksService,
          useValue: {
            create: vi.fn(),
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
          provide: SpotifyAlbumsService,
          useValue: {
            getAlbum: vi.fn(),
            getAlbums: vi.fn(),
          },
        },
      ],
    }).compile()

    albumsService = moduleRef.get(AlbumsService)
    albumsRepository = moduleRef.get(AlbumsRepository)
    tracksService = moduleRef.get(TracksService)
    artistsService = moduleRef.get(ArtistsService)
    imagesService = moduleRef.get(ImagesService)
    spotifyAlbumsService = moduleRef.get(SpotifyAlbumsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  describe('create', () => {
    let findOrCreateImagesSpy: MockInstance
    let findOrCreateArtistsSpy: MockInstance
    let createAlbumSpy: MockInstance
    let saveSpy: MockInstance
    let createTracksSpy: MockInstance

    beforeEach(() => {
      findOrCreateImagesSpy = vi.spyOn(imagesService, 'findOrCreate')
      findOrCreateArtistsSpy = vi.spyOn(artistsService, 'findOrCreate')
      createAlbumSpy = vi.spyOn(albumsRepository, 'createAlbum')
      saveSpy = vi.spyOn(albumsRepository, 'save')
      createTracksSpy = vi.spyOn(tracksService, 'create')
    })

    test('should create album without artists', async () => {
      findOrCreateImagesSpy.mockResolvedValue(imagesMock)
      findOrCreateArtistsSpy.mockResolvedValue(artistEntitiesMock)
      createTracksSpy.mockResolvedValue(trackEntitiesMock)
      saveSpy.mockReturnValue(albumEntityMock)
      createAlbumSpy.mockReturnValue(albumEntityMock)

      expect(await albumsService.create(sdkAlbumMock)).toEqual(albumEntityMock)
      expect(findOrCreateImagesSpy).toHaveBeenCalledWith(albumMock.images)
      expect(findOrCreateArtistsSpy).toHaveBeenCalledWith(sdkArtistsMock)
      expect(createTracksSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        [albumEntityMock]
      )
      expect(saveSpy).toHaveBeenCalledWith(albumEntityMock)
      expect(createAlbumSpy).toHaveBeenCalled()
    })

    test('should create album with artists', async () => {
      findOrCreateImagesSpy.mockResolvedValue(imagesMock)
      findOrCreateArtistsSpy.mockResolvedValue(artistEntitiesMock)
      createTracksSpy.mockResolvedValue(trackEntitiesMock)
      saveSpy.mockReturnValue(albumEntityMock)
      createAlbumSpy.mockReturnValue(albumEntityMock)

      expect(
        await albumsService.create(sdkAlbumMock, artistEntitiesMock)
      ).toEqual(albumEntityMock)
      expect(findOrCreateImagesSpy).toHaveBeenCalledWith(albumMock.images)
      expect(findOrCreateArtistsSpy).not.toHaveBeenCalled()
      expect(createTracksSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        [albumEntityMock]
      )
      expect(saveSpy).toHaveBeenCalledWith(albumEntityMock)
      expect(createAlbumSpy).toHaveBeenCalled()
    })
  })

  describe('findOrCreate', () => {
    let findOrCreateAlbumFromExternalIdSpy: MockInstance
    let findOrCreateAlbumsFromExternalIdsSpy: MockInstance

    beforeEach(() => {
      findOrCreateAlbumFromExternalIdSpy = vi.spyOn(
        albumsService,
        'findOrCreateAlbumFromExternalId'
      )
      findOrCreateAlbumsFromExternalIdsSpy = vi.spyOn(
        albumsService,
        'findOrCreateAlbumsFromExternalIds'
      )
    })

    test('should find or create album from external id', async () => {
      findOrCreateAlbumFromExternalIdSpy.mockResolvedValue(albumEntityMock)

      await albumsService.findOrCreate(externalId)

      expect(findOrCreateAlbumFromExternalIdSpy).toHaveBeenCalledWith(
        externalId
      )

      expect(findOrCreateAlbumsFromExternalIdsSpy).not.toHaveBeenCalled()
    })

    test('should find or create albums from external ids', async () => {
      const externalIds = [externalId]

      findOrCreateAlbumsFromExternalIdsSpy.mockResolvedValue([albumEntityMock])

      await albumsService.findOrCreate(externalIds)

      expect(findOrCreateAlbumsFromExternalIdsSpy).toHaveBeenCalledWith(
        externalIds,
        undefined
      )

      expect(findOrCreateAlbumFromExternalIdSpy).not.toHaveBeenCalled()
    })
  })

  describe('findOrCreateAlbumFromExternalId', () => {
    let findAlbumByExternalIdSpy: MockInstance
    let getAlbumSpy: GetAlbumMockInstance
    let createTracksSpy: MockInstance
    let createSpy: MockInstance
    let saveSpy: MockInstance

    beforeEach(() => {
      findAlbumByExternalIdSpy = vi.spyOn(
        albumsRepository,
        'findAlbumByExternalId'
      )
      getAlbumSpy = vi.spyOn(
        spotifyAlbumsService,
        'getAlbum'
      ) as unknown as GetAlbumMockInstance
      createTracksSpy = vi.spyOn(tracksService, 'create')
      createSpy = vi.spyOn(albumsService, 'create')
      saveSpy = vi.spyOn(albumsRepository, 'save')
    })

    test('should create tracks and return found album with tracks', async () => {
      const foundAlbumMock = {
        ...albumEntityMock,
        tracks: trackEntitiesMock,
      }

      findAlbumByExternalIdSpy.mockResolvedValue(foundAlbumMock)
      getAlbumSpy.mockResolvedValue(sdkAlbumMock)
      createTracksSpy.mockResolvedValue(trackEntitiesMock)
      createSpy.mockResolvedValue(albumEntityMock)
      saveSpy.mockResolvedValue(foundAlbumMock)

      expect(
        await albumsService.findOrCreateAlbumFromExternalId(externalId)
      ).toEqual(foundAlbumMock)
      expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
      expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
      expect(createTracksSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        [foundAlbumMock]
      )
      expect(saveSpy).toHaveBeenCalledWith(foundAlbumMock)
      expect(createSpy).not.toHaveBeenCalled()
    })

    test('should create album from external id', async () => {
      findAlbumByExternalIdSpy.mockResolvedValue(null)
      getAlbumSpy.mockResolvedValue(sdkAlbumMock)
      createSpy.mockResolvedValue(albumEntityMock)

      expect(
        await albumsService.findOrCreateAlbumFromExternalId(externalId)
      ).toEqual(albumEntityMock)
      expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
      expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
      expect(createSpy).toHaveBeenCalledWith(sdkAlbumMock, undefined)
    })
  })

  describe('findOrCreateAlbumsFromExternalIds', () => {
    let getAlbumsSpy: GetAlbumsMockInstance
    let createSpy: MockInstance
    let saveSpy: MockInstance
    let findAlbumsByExternalIdsSpy: MockInstance

    beforeEach(() => {
      getAlbumsSpy = vi.spyOn(
        spotifyAlbumsService,
        'getAlbums'
      ) as unknown as GetAlbumsMockInstance
      createSpy = vi.spyOn(albumsService, 'create')
      saveSpy = vi.spyOn(albumsRepository, 'save')
      findAlbumsByExternalIdsSpy = vi.spyOn(
        albumsRepository,
        'findAlbumsByExternalIds'
      )
    })

    test('should create albums from external ids', async () => {
      const externalIds = [externalId]

      getAlbumsSpy.mockResolvedValue([sdkAlbumMock])
      createSpy.mockResolvedValue(albumEntityMock)
      findAlbumsByExternalIdsSpy.mockResolvedValue([])

      expect(
        await albumsService.findOrCreateAlbumsFromExternalIds(externalIds)
      ).toEqual([albumEntityMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(createSpy).toHaveBeenCalledWith(sdkAlbumMock, undefined)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith(externalIds)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledTimes(
        externalIds.length
      )
    })

    test('should create tracks and return found album with tracks', async () => {
      const externalIds = [sdkAlbumMock.id]
      const foundAlbumMock = {
        ...albumEntityMock,
        tracks: trackEntitiesMock,
      }

      getAlbumsSpy.mockResolvedValue([sdkAlbumMock])
      findAlbumsByExternalIdsSpy.mockResolvedValue([foundAlbumMock])
      saveSpy.mockResolvedValue(foundAlbumMock)
      const createTracksSpy = vi
        .spyOn(tracksService, 'create')
        .mockResolvedValue(trackEntitiesMock)

      expect(
        await albumsService.findOrCreateAlbumsFromExternalIds(externalIds)
      ).toEqual([foundAlbumMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith(externalIds)
      expect(createTracksSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        [foundAlbumMock]
      )
      expect(saveSpy).toHaveBeenCalledWith(foundAlbumMock)
      expect(createSpy).not.toHaveBeenCalled()
    })

    test('should create albums from external ids with artists', async () => {
      const externalIds = [externalId]
      const artists = [artistEntityMock]

      getAlbumsSpy.mockResolvedValue([sdkAlbumMock])
      createSpy.mockResolvedValue(albumEntityMock)
      findAlbumsByExternalIdsSpy.mockResolvedValue([])

      expect(
        await albumsService.findOrCreateAlbumsFromExternalIds(
          externalIds,
          artists
        )
      ).toEqual([albumEntityMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(createSpy).toHaveBeenCalledWith(sdkAlbumMock, artists)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith(externalIds)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledTimes(
        externalIds.length
      )
    })
  })
})
