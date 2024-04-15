import { Test } from '@nestjs/testing'
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

  let albumsService: AlbumsService
  let albumsRepository: AlbumsRepository
  let tracksService: TracksService
  let artistsService: ArtistsService
  let imagesService: ImagesService
  let spotifyAlbumsService: SpotifyAlbumsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: AlbumsRepository,
          useValue: {
            findAlbumByExternalId: vi.fn(),
            createAlbum: vi.fn(),
            findAlbumsByExternalIds: vi.fn(),
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

    albumsService = module.get(AlbumsService)
    albumsRepository = module.get(AlbumsRepository)
    tracksService = module.get(TracksService)
    artistsService = module.get(ArtistsService)
    imagesService = module.get(ImagesService)
    spotifyAlbumsService = module.get(SpotifyAlbumsService)
  })

  describe('create', () => {
    let createAlbumFromExternalIdSpy: MockInstance
    let createAlbumFromDtoSpy: MockInstance

    beforeEach(() => {
      createAlbumFromExternalIdSpy = vi.spyOn(
        albumsService,
        'createAlbumFromExternalId'
      )
      createAlbumFromDtoSpy = vi.spyOn(albumsService, 'createAlbumFromDto')
    })

    test('should create album from dto', async () => {
      createAlbumFromDtoSpy.mockResolvedValue(albumEntityMock)

      await albumsService.create(sdkAlbumMock)

      expect(createAlbumFromDtoSpy).toHaveBeenCalledWith(
        sdkAlbumMock,
        undefined
      )
      expect(createAlbumFromExternalIdSpy).not.toHaveBeenCalled()
    })

    test('should create album from external id', async () => {
      createAlbumFromExternalIdSpy.mockResolvedValue(albumEntityMock)

      await albumsService.create(externalId)

      expect(createAlbumFromExternalIdSpy).toHaveBeenCalledWith(externalId)
      expect(createAlbumFromDtoSpy).not.toHaveBeenCalled()
    })
  })

  describe('createAlbumFromDto', () => {
    let findOrCreateImagesSpy: MockInstance
    let findOrCreateArtistsSpy: MockInstance
    let createAlbumSpy: MockInstance
    let createTracksSpy: MockInstance

    beforeEach(() => {
      findOrCreateImagesSpy = vi.spyOn(imagesService, 'findOrCreate')
      findOrCreateArtistsSpy = vi.spyOn(artistsService, 'findOrCreate')
      createAlbumSpy = vi.spyOn(albumsRepository, 'createAlbum')
      createTracksSpy = vi.spyOn(tracksService, 'create')
    })

    test('should create album without artists', async () => {
      findOrCreateImagesSpy.mockResolvedValue(imagesMock)
      findOrCreateArtistsSpy.mockResolvedValue(artistEntitiesMock)
      createTracksSpy.mockResolvedValue(trackEntitiesMock)
      createAlbumSpy.mockReturnValue(albumEntityMock)

      expect(await albumsService.createAlbumFromDto(sdkAlbumMock)).toEqual(
        albumEntityMock
      )
      expect(findOrCreateImagesSpy).toHaveBeenCalledWith(albumMock.images)
      expect(findOrCreateArtistsSpy).toHaveBeenCalledWith(sdkArtistsMock)
      expect(createTracksSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        [albumEntityMock]
      )
      expect(createAlbumSpy).toHaveBeenCalled()
    })

    test('should create album with artists', async () => {
      findOrCreateImagesSpy.mockResolvedValue(imagesMock)
      findOrCreateArtistsSpy.mockResolvedValue(artistEntitiesMock)
      createTracksSpy.mockResolvedValue(trackEntitiesMock)
      createAlbumSpy.mockReturnValue(albumEntityMock)

      expect(
        await albumsService.createAlbumFromDto(sdkAlbumMock, artistEntitiesMock)
      ).toEqual(albumEntityMock)
      expect(findOrCreateImagesSpy).toHaveBeenCalledWith(albumMock.images)
      expect(findOrCreateArtistsSpy).not.toHaveBeenCalled()
      expect(createTracksSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        [albumEntityMock]
      )
      expect(createAlbumSpy).toHaveBeenCalled()
    })
  })

  test('should create album from external id', async () => {
    const getAlbumSpy = vi.spyOn(
      spotifyAlbumsService,
      'getAlbum'
    ) as unknown as GetAlbumMockInstance
    const createAlbumFromDtoSpy = vi.spyOn(albumsService, 'createAlbumFromDto')

    getAlbumSpy.mockResolvedValue(sdkAlbumMock)
    createAlbumFromDtoSpy.mockResolvedValue(albumEntityMock)

    expect(await albumsService.createAlbumFromExternalId(externalId)).toEqual(
      albumEntityMock
    )
    expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
    expect(createAlbumFromDtoSpy).toHaveBeenCalledWith(sdkAlbumMock)
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

      expect(
        await albumsService.findOrCreateAlbumFromExternalId(externalId)
      ).toEqual(foundAlbumMock)
      expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
      expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
      expect(createTracksSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        [foundAlbumMock]
      )
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
    let findAlbumsByExternalIdsSpy: MockInstance

    beforeEach(() => {
      getAlbumsSpy = vi.spyOn(
        spotifyAlbumsService,
        'getAlbums'
      ) as unknown as GetAlbumsMockInstance
      createSpy = vi.spyOn(albumsService, 'create')
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
