import { DataSource } from 'typeorm'
import { Test } from '@nestjs/testing'

import { AlbumsRepository } from './albums.repository'

import { ArtistsRepository } from '@modules/artists'
import { ImagesRepository } from '@modules/images'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import {
  albumEntityMock,
  albumMock,
  artistEntitiesMock,
  imagesMock,
} from '@common/mocks'

describe('AlbumsRepository', () => {
  let albumsRepository: AlbumsRepository
  let imagesRepository: ImagesRepository
  let artistsRepository: ArtistsRepository
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
          provide: SpotifyAlbumsService,
          useValue: {
            getAlbum: vi.fn(),
          },
        },
      ],
    }).compile()

    albumsRepository = module.get(AlbumsRepository)
    imagesRepository = module.get(ImagesRepository)
    artistsRepository = module.get(ArtistsRepository)
    spotifyAlbumsService = module.get(SpotifyAlbumsService)
  })

  test('should be defined', () => {
    expect(albumsRepository).toBeDefined()
  })

  test('should create album', async () => {
    const createImageSpy = vi
      .spyOn(imagesRepository, 'findOrCreateImages')
      .mockResolvedValue(imagesMock)
    const createArtistSpy = vi
      .spyOn(artistsRepository, 'findOrCreateArtists')
      .mockResolvedValue(artistEntitiesMock)
    const createSpy = vi
      .spyOn(albumsRepository, 'create')
      .mockReturnValue(albumEntityMock)
    const saveSpy = vi
      .spyOn(albumsRepository, 'save')
      .mockResolvedValue(albumEntityMock)

    expect(await albumsRepository.createAlbum(albumMock)).toEqual(
      albumEntityMock
    )
    expect(createImageSpy).toHaveBeenCalledWith(albumMock.images)
    expect(createArtistSpy).toHaveBeenCalledWith(
      artistEntitiesMock.map(artist => artist.id)
    )
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(albumEntityMock)
  })

  describe('findOrCreateAlbum', () => {
    test('should find album', async () => {
      const findOneSpy = vi
        .spyOn(albumsRepository, 'findOne')
        .mockResolvedValue(albumEntityMock)
      const createAlbumSpy = vi.spyOn(albumsRepository, 'createAlbum')

      expect(await albumsRepository.findOrCreateAlbum(albumMock.id)).toEqual(
        albumEntityMock
      )
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { externalId: albumMock.id },
      })
      expect(createAlbumSpy).not.toHaveBeenCalled()
    })

    test('should create album', async () => {
      const getAlbumSpy = vi
        .spyOn(spotifyAlbumsService, 'getAlbum')
        .mockResolvedValue(albumMock)
      const findOneSpy = vi
        .spyOn(albumsRepository, 'findOne')
        .mockResolvedValue(null)
      const createAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)

      expect(await albumsRepository.findOrCreateAlbum(albumMock.id)).toEqual(
        albumEntityMock
      )
      expect(getAlbumSpy).toHaveBeenCalledWith(albumMock.id)
      expect(createAlbumSpy).toHaveBeenCalledWith(albumMock)
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { externalId: albumMock.id },
      })
    })
  })

  test('should find or create albums', async () => {
    const findOrCreateAlbumSpy = vi
      .spyOn(albumsRepository, 'findOrCreateAlbum')
      .mockResolvedValue(albumEntityMock)

    expect(await albumsRepository.findOrCreateAlbums([albumMock.id])).toEqual([
      albumEntityMock,
    ])
    expect(findOrCreateAlbumSpy).toHaveBeenCalledWith(albumMock.id)
  })
})
