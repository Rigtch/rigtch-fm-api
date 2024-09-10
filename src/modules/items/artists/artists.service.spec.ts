import { Test, TestingModule } from '@nestjs/testing'
import { EntityManager, In } from 'typeorm'
import { MockInstance } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

import { Artist } from './artist.entity'
import { ArtistsService } from './artists.service'

import {
  entityManagerFactoryMock,
  imagesMock,
  sdkImagesMock,
} from '@common/mocks'
import { SdkArtist } from '@common/types/spotify'
import { ImagesService } from '@modules/items/images'

describe('ArtistsService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let artistsService: ArtistsService
  let imagesService: ImagesService

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        ArtistsService,
        {
          provide: ImagesService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    artistsService = moduleRef.get(ArtistsService)
    imagesService = moduleRef.get(ImagesService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(artistsService).toBeDefined()
  })

  describe('findOrCreate', () => {
    const artistsExternalIds = ['id1', 'id2', 'id3']

    let sdkArtistsMock: MockProxy<SdkArtist>[]
    let artistsMock: MockProxy<Artist>[]

    let findBySpy: MockInstance
    let createSpy: MockInstance
    let saveSpy: MockInstance
    let imagesFindOrCreateSpy: MockInstance

    beforeEach(() => {
      sdkArtistsMock = Array.from({ length: 3 }, (_, index) =>
        mock<SdkArtist>({
          id: artistsExternalIds[index],
          images: sdkImagesMock,
          type: 'artist',
        })
      )
      artistsMock = Array.from({ length: 3 }, (_, index) =>
        mock<Artist>({
          externalId: artistsExternalIds[index],
          images: imagesMock,
        })
      )

      findBySpy = vi.spyOn(entityManagerMock, 'findBy')
      createSpy = vi.spyOn(entityManagerMock, 'create')
      saveSpy = vi.spyOn(entityManagerMock, 'save')
      imagesFindOrCreateSpy = vi.spyOn(imagesService, 'findOrCreate')
    })

    test('should find all artists and does not create any', async () => {
      findBySpy.mockResolvedValue(artistsMock)

      expect(
        await artistsService.findOrCreate(sdkArtistsMock, entityManagerMock)
      ).toEqual(artistsMock)

      expect(findBySpy).toHaveBeenCalledWith(Artist, {
        externalId: In(artistsExternalIds),
      })
      expect(findBySpy).toHaveBeenCalledTimes(1)
      expect(createSpy).not.toHaveBeenCalled()
      expect(saveSpy).not.toHaveBeenCalled()
      expect(imagesFindOrCreateSpy).not.toHaveBeenCalled()
    })

    test('should not find any artists and create all', async () => {
      findBySpy.mockResolvedValueOnce([])
      createSpy.mockImplementation((_, { externalId }) =>
        artistsMock.find(artist => artist.externalId === externalId)
      )
      saveSpy.mockResolvedValue(artistsMock)
      imagesFindOrCreateSpy.mockResolvedValue(imagesMock)

      expect(
        await artistsService.findOrCreate(sdkArtistsMock, entityManagerMock)
      ).toEqual(artistsMock)

      expect(findBySpy).toHaveBeenCalledWith(Artist, {
        externalId: In(artistsExternalIds),
      })
      expect(createSpy).toHaveBeenCalledWith(Artist, expect.anything())
      expect(createSpy).toHaveBeenCalledTimes(3)
      expect(saveSpy).toHaveBeenCalledWith(artistsMock)
      expect(imagesFindOrCreateSpy).toHaveBeenCalledWith(
        sdkImagesMock,
        entityManagerMock
      )
      expect(imagesFindOrCreateSpy).toHaveBeenCalledTimes(3)
    })

    test('should find some artists and create the rest', async () => {
      const foundArtistsMock = [artistsMock[0], artistsMock[1]]

      findBySpy.mockResolvedValueOnce(foundArtistsMock)
      createSpy.mockImplementation((_, { externalId }) =>
        artistsMock.find(artist => artist.externalId === externalId)
      )
      saveSpy.mockResolvedValue([artistsMock[2]])

      expect(
        await artistsService.findOrCreate(sdkArtistsMock, entityManagerMock)
      ).toEqual(artistsMock)

      expect(findBySpy).toHaveBeenCalledWith(Artist, {
        externalId: In(artistsExternalIds),
      })
      expect(createSpy).toHaveBeenCalledWith(Artist, expect.anything())
      expect(createSpy).toHaveBeenCalledTimes(1)
      expect(saveSpy).toHaveBeenCalledWith([artistsMock[2]])
      expect(imagesFindOrCreateSpy).toHaveBeenCalledWith(
        sdkImagesMock,
        entityManagerMock
      )
      expect(imagesFindOrCreateSpy).toHaveBeenCalledTimes(1)
    })
  })
})
