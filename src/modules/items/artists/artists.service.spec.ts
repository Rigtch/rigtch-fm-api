import { Test, TestingModule } from '@nestjs/testing'
import { DataSource, EntityManager, In, UpdateResult } from 'typeorm'
import { mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'

import { ArtistsService } from './artists.service'
import { Artist } from './artist.entity'

import {
  artistEntityMock,
  imagesMock,
  sdkArtistMock,
  transactionFactoryMock,
  entityManagerFactoryMock,
} from '@common/mocks'
import { Image } from '@modules/items/images'
import { EntityManagerCreateMockInstance } from '@common/types/mocks'

describe('ArtistsService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let artistsService: ArtistsService

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
      ],
    }).compile()

    artistsService = moduleRef.get(ArtistsService)
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
  })
})
