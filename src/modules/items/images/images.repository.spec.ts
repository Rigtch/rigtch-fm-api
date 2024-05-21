import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { ImagesRepository } from './images.repository'

import {
  imageMock,
  imagesMock,
  sdkImageMock,
  sdkImagesMock,
} from '@common/mocks'

describe('ImagesRepository', () => {
  let moduleRef: TestingModule
  let imagesRepository: ImagesRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ImagesRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    imagesRepository = moduleRef.get(ImagesRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(imagesRepository).toBeDefined()
  })

  test('should find image by url', async () => {
    const findOneSpy = vi
      .spyOn(imagesRepository, 'findOne')
      .mockResolvedValue(imageMock)

    expect(await imagesRepository.findImageByUrl(sdkImageMock.url)).toEqual(
      imageMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { url: sdkImageMock.url },
    })
  })

  test('should create image', async () => {
    const createSpy = vi
      .spyOn(imagesRepository, 'create')
      .mockReturnValue(imageMock)
    const saveSpy = vi
      .spyOn(imagesRepository, 'save')
      .mockResolvedValue(imageMock)

    expect(await imagesRepository.createImage(sdkImageMock)).toEqual(imageMock)
    expect(createSpy).toHaveBeenCalledWith(sdkImageMock)
    expect(saveSpy).toHaveBeenCalledWith(imageMock)
  })

  describe('findOrCreateImage', () => {
    test('should find image by url', async () => {
      const findImageByUrlSpy = vi
        .spyOn(imagesRepository, 'findImageByUrl')
        .mockResolvedValue(imageMock)
      const createImageSpy = vi.spyOn(imagesRepository, 'createImage')

      expect(await imagesRepository.findOrCreateImage(sdkImageMock)).toEqual(
        imageMock
      )
      expect(findImageByUrlSpy).toHaveBeenCalledWith(sdkImageMock.url)
      expect(createImageSpy).not.toHaveBeenCalled()
    })

    test('should create image', async () => {
      const createImageSpy = vi
        .spyOn(imagesRepository, 'createImage')
        .mockResolvedValue(imageMock)
      const findImageByUrlSpy = vi
        .spyOn(imagesRepository, 'findImageByUrl')
        .mockResolvedValue(null)

      expect(await imagesRepository.findOrCreateImage(sdkImageMock)).toEqual(
        imageMock
      )
      expect(createImageSpy).toHaveBeenCalledWith(sdkImageMock)
      expect(findImageByUrlSpy).toHaveBeenCalledWith(sdkImageMock.url)
    })
  })

  test('should find or create images', async () => {
    const findOrCreateImageSpy = vi
      .spyOn(imagesRepository, 'findOrCreateImage')
      .mockResolvedValue(imageMock)

    expect(await imagesRepository.findOrCreateImages(sdkImagesMock)).toEqual(
      imagesMock
    )
    expect(findOrCreateImageSpy).toHaveBeenCalledTimes(sdkImagesMock.length)
  })
})
