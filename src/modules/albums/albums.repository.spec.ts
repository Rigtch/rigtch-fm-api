import { DataSource } from 'typeorm'
import { Test } from '@nestjs/testing'

import { AlbumsRepository } from './albums.repository'

import { ArtistsRepository } from '@modules/artists'
import { ImagesRepository } from '@modules/images'
import {
  albumEntityMock,
  albumMock,
  artistEntitiesMock,
  imagesMock,
  sdkAlbumMock,
  trackEntitiesMock,
} from '@common/mocks'
import { TracksRepository } from '@modules/tracks'

describe('AlbumsRepository', () => {
  let albumsRepository: AlbumsRepository
  let imagesRepository: ImagesRepository
  let artistsRepository: ArtistsRepository
  let tracksRepository: TracksRepository

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
      ],
    }).compile()

    albumsRepository = module.get(AlbumsRepository)
    imagesRepository = module.get(ImagesRepository)
    artistsRepository = module.get(ArtistsRepository)
    tracksRepository = module.get(TracksRepository)
  })

  test('should be defined', () => {
    expect(albumsRepository).toBeDefined()
  })

  test('should find album by external id', async () => {
    const externalId = 'externalId'

    const findOneSpy = vi
      .spyOn(albumsRepository, 'findOne')
      .mockResolvedValue(albumEntityMock)

    expect(await albumsRepository.findAlbumByExternalId(externalId)).toEqual(
      albumEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { externalId },
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
    })
  })

  test.skip('should create album', async () => {
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
})
