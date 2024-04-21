import { DataSource, In } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { ArtistsRepository } from './artists.repository'

import {
  artistEntitiesMock,
  artistEntityMock,
  artistMock,
  imagesMock,
  sdkArtistMock,
} from '@common/mocks'

describe('ArtistsRepository', () => {
  let moduleRef: TestingModule
  let artistsRepository: ArtistsRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ArtistsRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    artistsRepository = moduleRef.get(ArtistsRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(artistsRepository).toBeDefined()
  })

  test('should find all artists', async () => {
    const findSpy = vi
      .spyOn(artistsRepository, 'find')
      .mockResolvedValue(artistEntitiesMock)

    expect(await artistsRepository.findArtists()).toEqual(artistEntitiesMock)

    expect(findSpy).toHaveBeenCalled()
  })

  test('should find artist by external id', async () => {
    const findOneSpy = vi
      .spyOn(artistsRepository, 'findOne')
      .mockResolvedValue(artistEntityMock)

    expect(
      await artistsRepository.findArtistByExternalId(artistMock.id)
    ).toEqual(artistEntityMock)

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { externalId: artistMock.id },
    })
  })

  test('should find artist by id', async () => {
    const findOneSpy = vi
      .spyOn(artistsRepository, 'findOne')
      .mockResolvedValue(artistEntityMock)

    expect(await artistsRepository.findArtistById(artistMock.id)).toEqual(
      artistEntityMock
    )

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { id: artistMock.id },
    })
  })

  test('should find artist by name', async () => {
    const findOneSpy = vi
      .spyOn(artistsRepository, 'findOne')
      .mockResolvedValue(artistEntityMock)

    expect(await artistsRepository.findArtistByName(artistMock.name)).toEqual(
      artistEntityMock
    )

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { name: artistMock.name },
    })
  })

  test('should find artists by external ids', async () => {
    const findSpy = vi
      .spyOn(artistsRepository, 'find')
      .mockResolvedValue(artistEntitiesMock)

    expect(
      await artistsRepository.findArtistsByExternalIds([artistMock.id])
    ).toEqual(artistEntitiesMock)

    expect(findSpy).toHaveBeenCalledWith({
      where: { externalId: In([artistMock.id]) },
    })
  })

  test('should create artist', async () => {
    const createSpy = vi
      .spyOn(artistsRepository, 'create')
      .mockReturnValue(artistEntityMock)
    const saveSpy = vi
      .spyOn(artistsRepository, 'save')
      .mockResolvedValue(artistEntityMock)

    expect(
      await artistsRepository.createArtist({
        ...sdkArtistMock,
        externalId: sdkArtistMock.id,
        followers: sdkArtistMock.followers.total,
        images: imagesMock,
      })
    ).toEqual(artistEntityMock)

    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(artistEntityMock)
  })
})
