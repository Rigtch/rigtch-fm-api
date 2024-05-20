import { Test, TestingModule } from '@nestjs/testing'
import { DataSource, EntityManager } from 'typeorm'
import { MockInstance } from 'vitest'

import { ImagesService } from './images.service'
import { ImagesRepository } from './images.repository'
import { Image } from './image.entity'

import {
  entityManagerFactoryMock,
  imageMock,
  imagesMock,
  sdkImageMock,
  sdkImagesMock,
  transactionFactoryMock,
} from '@common/mocks'
import { EntityManagerCreateMockInstance } from '@common/types/mocks'

describe('ImagesService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let imagesService: ImagesService
  let imagesRepository: ImagesRepository

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: ImagesRepository,
          useValue: {
            findImageByUrl: vi.fn(),
            createImage: vi.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: transactionFactoryMock(entityManagerMock),
          },
        },
      ],
    }).compile()

    imagesService = moduleRef.get(ImagesService)
    imagesRepository = moduleRef.get(ImagesRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(imagesService).toBeDefined()
  })

  test('create', async () => {
    const createImageSpy = vi
      .spyOn(imagesRepository, 'createImage')
      .mockResolvedValue(imageMock)

    expect(await imagesService.create(sdkImageMock)).toEqual(imageMock)
    expect(createImageSpy).toHaveBeenCalledWith(sdkImageMock)
  })

  describe('findOrCreate', () => {
    describe('findOrCreateOne', () => {
      let findOneBySpy: MockInstance

      beforeEach(() => {
        findOneBySpy = vi.spyOn(entityManagerMock, 'findOneBy')
      })

      test('should find image if exists', async () => {
        findOneBySpy.mockResolvedValue(imageMock)

        expect(await imagesService.findOrCreate(sdkImageMock)).toEqual(
          imageMock
        )
        expect(findOneBySpy).toHaveBeenCalledWith(Image, {
          url: sdkImageMock.url,
        })
      })

      test('should create image if not found', async () => {
        findOneBySpy.mockResolvedValue(null)
        const createSpy = (
          vi.spyOn(
            entityManagerMock,
            'create'
          ) as EntityManagerCreateMockInstance
        ).mockReturnValue(imageMock)
        const saveSpy = vi
          .spyOn(entityManagerMock, 'save')
          .mockResolvedValue(imageMock)

        expect(await imagesService.findOrCreate(sdkImageMock)).toEqual(
          imageMock
        )
        expect(findOneBySpy).toHaveBeenCalledWith(Image, {
          url: sdkImageMock.url,
        })
        expect(createSpy).toHaveBeenCalledWith(Image, sdkImageMock)
        expect(saveSpy).toHaveBeenCalledWith(imageMock)
      })
    })

    describe('findOrCreateMany', () => {
      test('should return empty array if no images', async () => {
        expect(await imagesService.findOrCreate([])).toEqual([])
      })

      test('should find or create images', async () => {
        const findOrCreateOneSpy = vi
          .spyOn(imagesService as never, 'findOrCreateOne')
          .mockResolvedValue(imageMock)

        expect(await imagesService.findOrCreate(sdkImagesMock)).toEqual(
          imagesMock
        )
        expect(findOrCreateOneSpy).toHaveBeenCalledWith(sdkImageMock)
        expect(findOrCreateOneSpy).toHaveBeenCalledTimes(sdkImagesMock.length)
      })
    })
  })
})
