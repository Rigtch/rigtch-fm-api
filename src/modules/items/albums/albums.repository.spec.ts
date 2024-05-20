import { DataSource, In } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { AlbumsRepository, albumsRelations } from './albums.repository'

import {
  albumEntityMock,
  albumMock,
  albumsEntitiesMock,
  artistEntitiesMock,
  imagesMock,
  sdkAlbumMock,
} from '@common/mocks'

describe('AlbumsRepository', () => {
  const externalId = 'externalId'

  let moduleRef: TestingModule
  let albumsRepository: AlbumsRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AlbumsRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    albumsRepository = moduleRef.get(AlbumsRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(albumsRepository).toBeDefined()
  })

  test('should find albums', async () => {
    const findSpy = vi
      .spyOn(albumsRepository, 'find')
      .mockResolvedValue(albumsEntitiesMock)

    expect(await albumsRepository.findAlbums()).toEqual(albumsEntitiesMock)
    expect(findSpy).toHaveBeenCalledWith({ relations: albumsRelations })
  })

  test('should find albums by external ids', async () => {
    const externalIds = [externalId]

    const findSpy = vi
      .spyOn(albumsRepository, 'find')
      .mockResolvedValue(albumsEntitiesMock)

    expect(await albumsRepository.findAlbumsByExternalIds(externalIds)).toEqual(
      albumsEntitiesMock
    )
    expect(findSpy).toHaveBeenCalledWith({
      where: { externalId: In(externalIds) },
      relations: albumsRelations,
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
      relations: albumsRelations,
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
      relations: albumsRelations,
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
      relations: albumsRelations,
    })
  })

  test('should create album', async () => {
    const createSpy = vi
      .spyOn(albumsRepository, 'create')
      .mockReturnValue(albumEntityMock)
    const saveSpy = vi
      .spyOn(albumsRepository, 'save')
      .mockResolvedValue(albumEntityMock)

    expect(
      await albumsRepository.createAlbum({
        ...albumMock,
        artists: artistEntitiesMock,
        releaseDate: new Date(sdkAlbumMock.release_date),
        externalId,
        albumType: sdkAlbumMock.album_type,
        images: imagesMock,
      })
    ).toEqual(albumEntityMock)
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(albumEntityMock)
  })
})
