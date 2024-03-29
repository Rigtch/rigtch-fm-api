import { DataSource, In } from 'typeorm'
import { Test } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { AlbumsRepository, relations } from './albums.repository'

import { ArtistsRepository } from '@modules/artists'
import { ImagesRepository } from '@modules/images'
import {
  albumEntityMock,
  albumMock,
  albumsEntitiesMock,
  artistEntitiesMock,
  artistEntityMock,
  imagesMock,
  sdkAlbumMock,
  sdkArtistsMock,
  trackEntitiesMock,
} from '@common/mocks'
import { TracksRepository } from '@modules/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import { SdkAlbum } from '@common/types/spotify'

type GetAlbumMockInstance = MockInstance<
  [id: string, adapt: false],
  Promise<SdkAlbum>
>
type GetAlbumsMockInstance = MockInstance<
  [ids: string[], adapt: false],
  Promise<SdkAlbum[]>
>

describe('AlbumsRepository', () => {
  const externalId = 'externalId'

  let albumsRepository: AlbumsRepository
  let imagesRepository: ImagesRepository
  let artistsRepository: ArtistsRepository
  let tracksRepository: TracksRepository
  let spotifyAlbumsService: SpotifyAlbumsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AlbumsRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
        {
          provide: ImagesRepository,
          useValue: {
            findOrCreateImages: vi.fn(),
          },
        },
        {
          provide: ArtistsRepository,
          useValue: {
            findOrCreateArtists: vi.fn(),
          },
        },
        {
          provide: TracksRepository,
          useValue: {
            createTracksFromExternalIds: vi.fn(),
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

    albumsRepository = module.get(AlbumsRepository)
    imagesRepository = module.get(ImagesRepository)
    artistsRepository = module.get(ArtistsRepository)
    tracksRepository = module.get(TracksRepository)
    spotifyAlbumsService = module.get(SpotifyAlbumsService)
  })

  test('should be defined', () => {
    expect(albumsRepository).toBeDefined()
  })

  test('should find albums', async () => {
    const findSpy = vi
      .spyOn(albumsRepository, 'find')
      .mockResolvedValue(albumsEntitiesMock)

    expect(await albumsRepository.findAlbums()).toEqual(albumsEntitiesMock)
    expect(findSpy).toHaveBeenCalledWith({ relations })
  })

  test('should find albums by external ids', async () => {
    const externalIds = ['externalId']

    const findSpy = vi
      .spyOn(albumsRepository, 'find')
      .mockResolvedValue(albumsEntitiesMock)

    expect(await albumsRepository.findAlbumsByExternalIds(externalIds)).toEqual(
      albumsEntitiesMock
    )
    expect(findSpy).toHaveBeenCalledWith({
      where: { externalId: In(externalIds) },
      relations,
    })
  })

  test('should find album by external id', async () => {
    const findOneSpy = vi
      .spyOn(albumsRepository, 'findOne')
      .mockResolvedValue(albumEntityMock)

    expect(await albumsRepository.findAlbumByExternalId(externalId)).toEqual(
      albumEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { externalId },
      relations,
    })
  })

  test('should find album by id', async () => {
    const id = 'id'

    const findOneSpy = vi
      .spyOn(albumsRepository, 'findOne')
      .mockResolvedValue(albumEntityMock)

    expect(await albumsRepository.findAlbumById(id)).toEqual(albumEntityMock)
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { id },
      relations,
    })
  })

  test('should find album by name', async () => {
    const name = 'name'

    const findOneSpy = vi
      .spyOn(albumsRepository, 'findOne')
      .mockResolvedValue(albumEntityMock)

    expect(await albumsRepository.findAlbumByName(name)).toEqual(
      albumEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { name },
      relations,
    })
  })

  describe('createAlbum', () => {
    test('should create album without artists', async () => {
      const findOrCreateImagesSpy = vi
        .spyOn(imagesRepository, 'findOrCreateImages')
        .mockResolvedValue(imagesMock)
      const findOrCreateArtistsSpy = vi
        .spyOn(artistsRepository, 'findOrCreateArtists')
        .mockResolvedValue(artistEntitiesMock)
      const createTracksFromExternalIdsSpy = vi
        .spyOn(tracksRepository, 'createTracksFromExternalIds')
        .mockResolvedValue(trackEntitiesMock)
      const createSpy = vi
        .spyOn(albumsRepository, 'create')
        .mockReturnValue(albumEntityMock)
      const saveSpy = vi
        .spyOn(albumsRepository, 'save')
        .mockResolvedValue(albumEntityMock)

      expect(await albumsRepository.createAlbum(sdkAlbumMock)).toEqual(
        albumEntityMock
      )
      expect(findOrCreateImagesSpy).toHaveBeenCalledWith(albumMock.images)
      expect(findOrCreateArtistsSpy).toHaveBeenCalledWith(sdkArtistsMock)
      expect(createTracksFromExternalIdsSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        albumEntityMock
      )
      expect(createSpy).toHaveBeenCalled()
      expect(saveSpy).toHaveBeenCalledWith(albumEntityMock)
    })

    test('should create album with artists', async () => {
      const findOrCreateImagesSpy = vi
        .spyOn(imagesRepository, 'findOrCreateImages')
        .mockResolvedValue(imagesMock)
      const findOrCreateArtistsSpy = vi
        .spyOn(artistsRepository, 'findOrCreateArtists')
        .mockResolvedValue(artistEntitiesMock)
      const createTracksFromExternalIdsSpy = vi
        .spyOn(tracksRepository, 'createTracksFromExternalIds')
        .mockResolvedValue(trackEntitiesMock)
      const createSpy = vi
        .spyOn(albumsRepository, 'create')
        .mockReturnValue(albumEntityMock)
      const saveSpy = vi
        .spyOn(albumsRepository, 'save')
        .mockResolvedValue(albumEntityMock)

      expect(
        await albumsRepository.createAlbum(sdkAlbumMock, artistEntitiesMock)
      ).toEqual(albumEntityMock)
      expect(findOrCreateImagesSpy).toHaveBeenCalledWith(albumMock.images)
      expect(findOrCreateArtistsSpy).not.toHaveBeenCalled()
      expect(createTracksFromExternalIdsSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        albumEntityMock
      )
      expect(createSpy).toHaveBeenCalled()
      expect(saveSpy).toHaveBeenCalledWith(albumEntityMock)
    })
  })

  describe('findOrCreateAlbumFromExternalId', () => {
    test('should create tracks and return found album with tracks', async () => {
      const foundAlbumMock = {
        ...albumEntityMock,
        tracks: trackEntitiesMock,
      }

      const findAlbumByExternalIdSpy = vi
        .spyOn(albumsRepository, 'findAlbumByExternalId')
        .mockResolvedValue(foundAlbumMock)
      const getAlbumSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbum'
        ) as unknown as GetAlbumMockInstance
      ).mockResolvedValue(sdkAlbumMock)
      const createTracksFromExternalIdsSpy = vi
        .spyOn(tracksRepository, 'createTracksFromExternalIds')
        .mockResolvedValue(trackEntitiesMock)
      const createAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)

      expect(
        await albumsRepository.findOrCreateAlbumFromExternalId(externalId)
      ).toEqual(foundAlbumMock)
      expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
      expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
      expect(createTracksFromExternalIdsSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        foundAlbumMock
      )
      expect(createAlbumSpy).not.toHaveBeenCalled()
    })

    test('should create album from external id', async () => {
      const findAlbumByExternalIdSpy = vi
        .spyOn(albumsRepository, 'findAlbumByExternalId')
        .mockResolvedValue(null)
      const getAlbumSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbum'
        ) as unknown as GetAlbumMockInstance
      ).mockResolvedValue(sdkAlbumMock)
      const creatAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)

      expect(
        await albumsRepository.findOrCreateAlbumFromExternalId(externalId)
      ).toEqual(albumEntityMock)
      expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
      expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
      expect(creatAlbumSpy).toHaveBeenCalledWith(sdkAlbumMock)
    })
  })

  describe('findOrCreateAlbumsFromExternalIds', () => {
    test('should create albums from external ids', async () => {
      const externalIds = [externalId]

      const getAlbumsSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbums'
        ) as unknown as GetAlbumsMockInstance
      ).mockResolvedValue([sdkAlbumMock])
      const createAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)
      const findAlbumsByExternalIdsSpy = vi
        .spyOn(albumsRepository, 'findAlbumsByExternalIds')
        .mockResolvedValue([])

      expect(
        await albumsRepository.findOrCreateAlbumsFromExternalIds(externalIds)
      ).toEqual([albumEntityMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(createAlbumSpy).toHaveBeenCalledWith(sdkAlbumMock, undefined)
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

      const getAlbumsSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbums'
        ) as unknown as GetAlbumsMockInstance
      ).mockResolvedValue([sdkAlbumMock])
      const findAlbumsByExternalIdsSpy = vi
        .spyOn(albumsRepository, 'findAlbumsByExternalIds')
        .mockResolvedValue([foundAlbumMock])
      const createTracksFromExternalIdsSpy = vi
        .spyOn(tracksRepository, 'createTracksFromExternalIds')
        .mockResolvedValue(trackEntitiesMock)
      const createAlbumSpy = vi.spyOn(albumsRepository, 'createAlbum')

      expect(
        await albumsRepository.findOrCreateAlbumsFromExternalIds(externalIds)
      ).toEqual([foundAlbumMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith(externalIds)
      expect(createTracksFromExternalIdsSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        foundAlbumMock
      )
      expect(createAlbumSpy).not.toHaveBeenCalled()
    })

    test('should create albums from external ids with artists', async () => {
      const externalIds = [externalId]
      const artists = [artistEntityMock]

      const getAlbumsSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbums'
        ) as unknown as GetAlbumsMockInstance
      ).mockResolvedValue([sdkAlbumMock])
      const createAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)
      const findAlbumsByExternalIdsSpy = vi
        .spyOn(albumsRepository, 'findAlbumsByExternalIds')
        .mockResolvedValue([])

      expect(
        await albumsRepository.findOrCreateAlbumsFromExternalIds(
          externalIds,
          artists
        )
      ).toEqual([albumEntityMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(createAlbumSpy).toHaveBeenCalledWith(sdkAlbumMock, artists)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith(externalIds)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledTimes(
        externalIds.length
      )
    })
  })
})
