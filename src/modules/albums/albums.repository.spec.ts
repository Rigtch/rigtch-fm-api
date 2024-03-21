import { DataSource } from 'typeorm'
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
  imagesMock,
  sdkAlbumMock,
  trackEntitiesMock,
} from '@common/mocks'
import { TracksRepository } from '@modules/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import { SdkAlbum } from '@common/types/spotify'

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
            findOrCreateArtistsFromExternalIds: vi.fn(),
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

  test('should create album', async () => {
    const findOrCreateImagesSpy = vi
      .spyOn(imagesRepository, 'findOrCreateImages')
      .mockResolvedValue(imagesMock)
    const findOrCreateArtistsSpy = vi
      .spyOn(artistsRepository, 'findOrCreateArtistsFromExternalIds')
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
    expect(findOrCreateArtistsSpy).toHaveBeenCalledWith(
      artistEntitiesMock.map(artist => artist.id)
    )
    expect(createTracksFromExternalIdsSpy).toHaveBeenCalledWith(
      trackEntitiesMock.map(track => track.id),
      albumEntityMock
    )
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(albumEntityMock)
  })

  test('should create album from external id', async () => {
    const getAlbumSpy = (
      vi.spyOn(spotifyAlbumsService, 'getAlbum') as unknown as MockInstance<
        [id: string, adapt: false],
        Promise<SdkAlbum>
      >
    ).mockResolvedValue(sdkAlbumMock)
    const creatAlbumSpy = vi
      .spyOn(albumsRepository, 'createAlbum')
      .mockResolvedValue(albumEntityMock)

    expect(
      await albumsRepository.createAlbumFromExternalId(externalId)
    ).toEqual(albumEntityMock)
    expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
    expect(creatAlbumSpy).toHaveBeenCalledWith(sdkAlbumMock)
  })

  test('should create albums from external ids', async () => {
    const externalIds = [externalId]

    const getAlbumsSpy = (
      vi.spyOn(spotifyAlbumsService, 'getAlbums') as unknown as MockInstance<
        [ids: string[], adapt: false],
        Promise<SdkAlbum[]>
      >
    ).mockResolvedValue([sdkAlbumMock])
    const creatAlbumSpy = vi
      .spyOn(albumsRepository, 'createAlbum')
      .mockResolvedValue(albumEntityMock)

    expect(
      await albumsRepository.createAlbumsFromExternalIds(externalIds)
    ).toEqual([albumEntityMock])
    expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
    expect(creatAlbumSpy).toHaveBeenCalledWith(sdkAlbumMock)
  })
})
