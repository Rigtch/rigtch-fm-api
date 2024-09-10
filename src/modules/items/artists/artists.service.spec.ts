import { Test, TestingModule } from '@nestjs/testing'
import { DataSource, EntityManager, In, UpdateResult } from 'typeorm'
import { mock, MockProxy } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'

import { ArtistsService } from './artists.service'
import { Artist } from './artist.entity'

import {
  artistEntityMock,
  imagesMock,
  sdkArtistMock,
  transactionFactoryMock,
  entityManagerFactoryMock,
  sdkImagesMock,
} from '@common/mocks'
import { Image, ImagesService } from '@modules/items/images'
import { EntityManagerCreateMockInstance } from '@common/types/mocks'
import { SdkArtist } from '@common/types/spotify'

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
          provide: DataSource,
          useValue: {
            transaction: transactionFactoryMock(entityManagerMock),
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

    artistsService = moduleRef.get(ArtistsService)
    imagesService = moduleRef.get(ImagesService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(artistsService).toBeDefined()
  })

  describe('updateOrCreate', () => {
    describe('updateOrCreateOne', () => {
      let findOneBySpy: MockInstance

      beforeEach(() => {
        findOneBySpy = vi.spyOn(entityManagerMock, 'findOneBy')
      })

      test('should update artist if found', async () => {
        findOneBySpy.mockResolvedValue(artistEntityMock)
        const updateSpy = vi
          .spyOn(entityManagerMock, 'update')
          .mockResolvedValue(mock<UpdateResult>())

        expect(await artistsService.updateOrCreate(sdkArtistMock)).toEqual(
          artistEntityMock
        )
        expect(findOneBySpy).toHaveBeenCalledWith(Artist, {
          externalId: sdkArtistMock.id,
        })
        expect(findOneBySpy).toHaveBeenCalledTimes(2)
        expect(updateSpy).toHaveBeenCalled()
      })

      test('should create artist if not found', async () => {
        findOneBySpy.mockResolvedValue(null)
        const findBy = vi
          .spyOn(entityManagerMock, 'findBy')
          .mockResolvedValue(imagesMock)
        const createSpy = (
          vi.spyOn(
            entityManagerMock,
            'create'
          ) as EntityManagerCreateMockInstance
        ).mockReturnValue(artistEntityMock)
        const saveSpy = vi
          .spyOn(entityManagerMock, 'save')
          .mockResolvedValue(artistEntityMock)

        expect(await artistsService.updateOrCreate(sdkArtistMock)).toEqual(
          artistEntityMock
        )
        expect(findOneBySpy).toHaveBeenCalledWith(Artist, {
          externalId: sdkArtistMock.id,
        })
        expect(findOneBySpy).toHaveBeenCalledTimes(1)
        expect(findBy).toHaveBeenCalledWith(Image, {
          url: In(imagesMock.map(image => image.url)),
        })
        expect(createSpy).toHaveBeenCalled()
        expect(saveSpy).toHaveBeenCalledWith(artistEntityMock)
      })
    })

    describe('updateOrCreateMany', () => {
      test('should update or create many artists', async () => {
        const updateOrCreateOneSpy = vi
          // `as never` is used to avoid type error with private methods
          .spyOn(artistsService as never, 'updateOrCreateOne')
          .mockResolvedValue(artistEntityMock)
        const artists = Array.from({ length: 5 }).map(() => sdkArtistMock)
        expect(await artistsService.updateOrCreate(artists)).toEqual(
          Array.from({ length: 5 }).map(() => artistEntityMock)
        )
        expect(updateOrCreateOneSpy).toHaveBeenCalledTimes(5)
      })
    })

    describe('updateOrCreateManyInTransaction', () => {
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
          await artistsService.updateOrCreate(sdkArtistsMock, entityManagerMock)
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
          await artistsService.updateOrCreate(sdkArtistsMock, entityManagerMock)
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
          await artistsService.updateOrCreate(sdkArtistsMock, entityManagerMock)
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
})
