import { Test } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { ArtistsRepository } from './artists.repository'
import { ArtistsService } from './artists.service'

import { SpotifyArtistsService } from '@modules/spotify/artists'
import {
  artistEntityMock,
  sdkArtistMock,
  sdkArtistsMock,
  artistEntitiesMock,
  imagesMock,
} from '@common/mocks'
import { ImagesService } from '@modules/images'

describe('ArtistsService', () => {
  let artistsService: ArtistsService
  let artistsRepository: ArtistsRepository
  let spotifyArtistsService: SpotifyArtistsService
  let imagesService: ImagesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ArtistsService,
        {
          provide: ArtistsRepository,
          useValue: {
            findArtistByExternalId: vi.fn(),
            createArtist: vi.fn(),
            findArtistsByExternalIds: vi.fn(),
          },
        },
        {
          provide: SpotifyArtistsService,
          useValue: {
            getArtist: vi.fn(),
            getArtists: vi.fn(),
          },
        },
        {
          provide: ImagesService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    artistsService = module.get(ArtistsService)
    artistsRepository = module.get(ArtistsRepository)
    spotifyArtistsService = module.get(SpotifyArtistsService)
    imagesService = module.get(ImagesService)
  })

  test('should be defined', () => {
    expect(artistsService).toBeDefined()
  })

  describe('create', () => {
    let createArtistFromExternalIdSpy: MockInstance
    let createArtistFromDtoSpy: MockInstance

    beforeEach(() => {
      createArtistFromExternalIdSpy = vi.spyOn(
        artistsService,
        'createArtistFromExternalId'
      )
      createArtistFromDtoSpy = vi.spyOn(artistsService, 'createArtistFromDto')
    })

    test('should create artist from dto', async () => {
      createArtistFromDtoSpy.mockResolvedValue(artistEntityMock)

      expect(await artistsService.create(sdkArtistMock)).toEqual(
        artistEntityMock
      )

      expect(createArtistFromExternalIdSpy).not.toHaveBeenCalled()
      expect(createArtistFromDtoSpy).toHaveBeenCalledWith(sdkArtistMock)
    })

    test('should create artist from external id', async () => {
      createArtistFromExternalIdSpy.mockResolvedValue(artistEntityMock)

      expect(await artistsService.create(sdkArtistMock.id)).toEqual(
        artistEntityMock
      )

      expect(createArtistFromExternalIdSpy).toHaveBeenCalledWith(
        sdkArtistMock.id
      )
      expect(createArtistFromDtoSpy).not.toHaveBeenCalled()
    })
  })

  test('should create artist from dto', async () => {
    const findOrCreateImagesSpy = vi
      .spyOn(imagesService, 'findOrCreate')
      .mockResolvedValue(imagesMock)
    const createArtistSpy = vi
      .spyOn(artistsRepository, 'createArtist')
      .mockResolvedValue(artistEntityMock)

    expect(await artistsService.createArtistFromDto(sdkArtistMock)).toEqual(
      artistEntityMock
    )

    expect(findOrCreateImagesSpy).toHaveBeenCalledWith(sdkArtistMock.images)
    expect(createArtistSpy).toHaveBeenCalled()
  })

  test('should create artist from external id', async () => {
    const getArtistSpy = vi
      .spyOn(spotifyArtistsService, 'getArtist')
      .mockResolvedValue(sdkArtistMock)
    const createArtistSpy = vi
      .spyOn(artistsRepository, 'createArtist')
      .mockResolvedValue(artistEntityMock)

    expect(
      await artistsService.createArtistFromExternalId(sdkArtistMock.id)
    ).toEqual(artistEntityMock)

    expect(getArtistSpy).toHaveBeenCalledWith(sdkArtistMock.id, false)
    expect(createArtistSpy).toHaveBeenCalled()
  })

  describe('findOrCreate', () => {
    let findOrCreateArtistFromExternalIdSpy: MockInstance
    let findOrCreateArtistsFromExternalIdsSpy: MockInstance
    let findOrCreateArtistFromDtoSpy: MockInstance
    let findOrCreateArtistsFromDtosSpy: MockInstance

    beforeEach(() => {
      findOrCreateArtistFromExternalIdSpy = vi.spyOn(
        artistsService,
        'findOrCreateArtistFromExternalId'
      )
      findOrCreateArtistsFromExternalIdsSpy = vi.spyOn(
        artistsService,
        'findOrCreateArtistsFromExternalIds'
      )
      findOrCreateArtistFromDtoSpy = vi.spyOn(
        artistsService,
        'findOrCreateArtistFromDto'
      )
      findOrCreateArtistsFromDtosSpy = vi.spyOn(
        artistsService,
        'findOrCreateArtistsFromDtos'
      )
    })

    test('should find or create artist from external id', async () => {
      findOrCreateArtistFromExternalIdSpy.mockResolvedValue(artistEntityMock)

      expect(await artistsService.findOrCreate(sdkArtistMock.id)).toEqual(
        artistEntityMock
      )

      expect(findOrCreateArtistFromExternalIdSpy).toHaveBeenCalledWith(
        sdkArtistMock.id
      )
      expect(findOrCreateArtistsFromExternalIdsSpy).not.toHaveBeenCalled()
      expect(findOrCreateArtistFromDtoSpy).not.toHaveBeenCalled()
      expect(findOrCreateArtistsFromDtosSpy).not.toHaveBeenCalled()
    })

    test('should find or create artist from dto', async () => {
      findOrCreateArtistFromDtoSpy.mockResolvedValue(artistEntityMock)

      expect(await artistsService.findOrCreate(sdkArtistMock)).toEqual(
        artistEntityMock
      )

      expect(findOrCreateArtistFromDtoSpy).toHaveBeenCalledWith(sdkArtistMock)
      expect(findOrCreateArtistsFromExternalIdsSpy).not.toHaveBeenCalled()
      expect(findOrCreateArtistFromExternalIdSpy).not.toHaveBeenCalled()
      expect(findOrCreateArtistsFromDtosSpy).not.toHaveBeenCalled()
    })

    test('should find or create artists from external ids', async () => {
      findOrCreateArtistsFromExternalIdsSpy.mockResolvedValue(
        artistEntitiesMock
      )

      expect(
        await artistsService.findOrCreate([sdkArtistMock.id, sdkArtistMock.id])
      ).toEqual(artistEntitiesMock)

      expect(findOrCreateArtistsFromExternalIdsSpy).toHaveBeenCalledWith([
        sdkArtistMock.id,
        sdkArtistMock.id,
      ])
      expect(findOrCreateArtistFromExternalIdSpy).not.toHaveBeenCalled()
      expect(findOrCreateArtistFromDtoSpy).not.toHaveBeenCalled()
      expect(findOrCreateArtistsFromDtosSpy).not.toHaveBeenCalled()
    })

    test('should find or create artists from dtos', async () => {
      findOrCreateArtistsFromDtosSpy.mockResolvedValue(artistEntitiesMock)

      expect(
        await artistsService.findOrCreate([sdkArtistMock, sdkArtistMock])
      ).toEqual(artistEntitiesMock)

      expect(findOrCreateArtistsFromDtosSpy).toHaveBeenCalledWith([
        sdkArtistMock,
        sdkArtistMock,
      ])
      expect(findOrCreateArtistFromExternalIdSpy).not.toHaveBeenCalled()
      expect(findOrCreateArtistFromDtoSpy).not.toHaveBeenCalled()
      expect(findOrCreateArtistsFromExternalIdsSpy).not.toHaveBeenCalled()
    })
  })

  describe('findOrCreateArtistFromDto', () => {
    let findArtistByExternalIdSpy: MockInstance
    let createSpy: MockInstance

    beforeEach(() => {
      findArtistByExternalIdSpy = vi.spyOn(
        artistsRepository,
        'findArtistByExternalId'
      )
      createSpy = vi.spyOn(artistsService, 'create')
    })

    test('should find artist from dto', async () => {
      findArtistByExternalIdSpy.mockResolvedValue(artistEntityMock)

      expect(
        await artistsService.findOrCreateArtistFromDto(sdkArtistMock)
      ).toEqual(artistEntityMock)
      expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(createSpy).not.toHaveBeenCalled()
    })

    test('should create artist from dto', async () => {
      findArtistByExternalIdSpy.mockResolvedValue(null)
      createSpy.mockResolvedValue(artistEntityMock)

      expect(
        await artistsService.findOrCreateArtistFromDto(sdkArtistMock)
      ).toEqual(artistEntityMock)
      expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(createSpy).toHaveBeenCalledWith(sdkArtistMock)
    })
  })

  test('should find or create artists from dtos', async () => {
    const findOrCreateArtistSpy = vi
      .spyOn(artistsService, 'findOrCreateArtistFromDto')
      .mockResolvedValue(artistEntityMock)

    expect(
      await artistsService.findOrCreateArtistsFromDtos(sdkArtistsMock)
    ).toEqual(artistEntitiesMock)
    expect(findOrCreateArtistSpy).toHaveBeenCalledWith(sdkArtistMock)
  })

  describe('findOrCreateArtistByExternalId', () => {
    let findArtistByExternalIdSpy: MockInstance
    let getArtistSpy: MockInstance
    let createSpy: MockInstance

    beforeEach(() => {
      findArtistByExternalIdSpy = vi.spyOn(
        artistsRepository,
        'findArtistByExternalId'
      )
      getArtistSpy = vi.spyOn(spotifyArtistsService, 'getArtist')
      createSpy = vi.spyOn(artistsService, 'create')
    })

    test('should find artist by id', async () => {
      findArtistByExternalIdSpy.mockResolvedValue(artistEntityMock)
      getArtistSpy.mockResolvedValue(sdkArtistMock)

      expect(
        await artistsService.findOrCreateArtistFromExternalId(sdkArtistMock.id)
      ).toEqual(artistEntityMock)
      expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(getArtistSpy).not.toHaveBeenCalled()
      expect(createSpy).not.toHaveBeenCalled()
    })

    test('should create artist by id', async () => {
      findArtistByExternalIdSpy.mockResolvedValue(null)
      getArtistSpy.mockResolvedValue(sdkArtistMock)
      createSpy.mockResolvedValue(artistEntityMock)

      expect(
        await artistsService.findOrCreateArtistFromExternalId(sdkArtistMock.id)
      ).toEqual(artistEntityMock)
      expect(findArtistByExternalIdSpy).toHaveBeenCalledWith(sdkArtistMock.id)
      expect(getArtistSpy).toHaveBeenCalledWith(sdkArtistMock.id, false)
      expect(createSpy).toHaveBeenCalledWith(sdkArtistMock)
    })
  })

  describe('findOrCreateArtistsByExternalIds', () => {
    const ids = sdkArtistsMock.map(artist => artist.id)

    let findArtistsByExternalIdsSpy: MockInstance
    let getArtistsSpy: MockInstance
    let createSpy: MockInstance

    beforeEach(() => {
      findArtistsByExternalIdsSpy = vi.spyOn(
        artistsRepository,
        'findArtistsByExternalIds'
      )
      getArtistsSpy = vi.spyOn(spotifyArtistsService, 'getArtists')
      createSpy = vi.spyOn(artistsService, 'create')
    })

    test('should find artists by external ids', async () => {
      findArtistsByExternalIdsSpy.mockResolvedValue(artistEntitiesMock)

      expect(
        await artistsService.findOrCreateArtistsFromExternalIds(ids)
      ).toEqual(artistEntitiesMock)
      expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith(ids)
      expect(createSpy).not.toHaveBeenCalled()
      expect(getArtistsSpy).not.toHaveBeenCalled()
    })

    test('should create artists by external ids', async () => {
      findArtistsByExternalIdsSpy.mockResolvedValue([])
      getArtistsSpy.mockResolvedValue(sdkArtistsMock)
      createSpy.mockResolvedValue(artistEntityMock)

      expect(
        await artistsService.findOrCreateArtistsFromExternalIds(ids)
      ).toEqual(artistEntitiesMock)
      expect(findArtistsByExternalIdsSpy).toHaveBeenCalledWith(ids)
      expect(getArtistsSpy).toHaveBeenCalledWith(ids, false)
      expect(createSpy).toHaveBeenCalledWith(sdkArtistMock)
    })
  })
})
