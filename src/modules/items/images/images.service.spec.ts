import { Test, TestingModule } from '@nestjs/testing'
import { DataSource, EntityManager, In } from 'typeorm'
import { MockInstance } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

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
import { SdkImage } from '@common/types/spotify'

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

    describe('findOrCreateManyInTransaction', () => {
      const imagesUrls = ['url1', 'url2', 'url3']

      let sdkImagesMock: MockProxy<SdkImage[]>
      let imagesMock: MockProxy<Image[]>

      let findBySpy: MockInstance
      let createSpy: MockInstance
      let saveSpy: MockInstance

      beforeEach(() => {
        sdkImagesMock = Array.from({ length: 3 }, (_, index) =>
          mock<SdkImage>({
            url: imagesUrls[index],
          })
        )
        imagesMock = Array.from({ length: 3 }, (_, index) =>
          mock<Image>({
            url: imagesUrls[index],
          })
        )

        findBySpy = vi.spyOn(entityManagerMock, 'findBy')
        createSpy = vi.spyOn(entityManagerMock, 'create')
        saveSpy = vi.spyOn(entityManagerMock, 'save')
      })

      test('should return empty array if no images', async () => {
        expect(await imagesService.findOrCreate([], entityManagerMock)).toEqual(
          []
        )

        expect(findBySpy).not.toHaveBeenCalled()
        expect(createSpy).not.toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
      })

      test('should find all images and does not create any', async () => {
        findBySpy.mockResolvedValue(imagesMock)

        expect(
          await imagesService.findOrCreate(sdkImagesMock, entityManagerMock)
        ).toEqual(imagesMock)

        expect(findBySpy).toHaveBeenCalledWith(Image, {
          url: In(imagesMock.map(image => image.url)),
        })
        expect(findBySpy).toHaveBeenCalledTimes(1)
        expect(createSpy).not.toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
      })

      test('should not find any images and create all', async () => {
        findBySpy.mockResolvedValue([])
        createSpy.mockReturnValue(imagesMock)
        saveSpy.mockResolvedValue(imagesMock)

        expect(
          await imagesService.findOrCreate(sdkImagesMock, entityManagerMock)
        ).toEqual(imagesMock)

        expect(findBySpy).toHaveBeenCalledWith(Image, {
          url: In(imagesMock.map(image => image.url)),
        })
        expect(createSpy).toHaveBeenCalledWith(Image, sdkImagesMock)
        expect(saveSpy).toHaveBeenCalledWith(imagesMock)
      })

      test('should find some images and create the rest', async () => {
        findBySpy.mockResolvedValue([imagesMock[0], imagesMock[1]])
        createSpy.mockReturnValue([imagesMock[2]])
        saveSpy.mockResolvedValue([imagesMock[2]])

        expect(
          await imagesService.findOrCreate(sdkImagesMock, entityManagerMock)
        ).toEqual(imagesMock)

        expect(findBySpy).toHaveBeenCalledWith(Image, {
          url: In(imagesMock.map(image => image.url)),
        })
        expect(createSpy).toHaveBeenCalledWith(Image, [sdkImagesMock[2]])
        expect(saveSpy).toHaveBeenCalledWith([imagesMock[2]])
      })
    })
  })
})
