import { Test } from '@nestjs/testing'

import { ImagesService } from './images.service'
import { ImagesRepository } from './images.repository'

import {
  imageMock,
  imagesMock,
  sdkImageMock,
  sdkImagesMock,
} from '@common/mocks'

describe('ImagesService', () => {
  let imagesService: ImagesService
  let imagesRepository: ImagesRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: ImagesRepository,
          useValue: {
            findImageByUrl: vi.fn(),
            createImage: vi.fn(),
          },
        },
      ],
    }).compile()

    imagesService = module.get(ImagesService)
    imagesRepository = module.get(ImagesRepository)
  })

  test('should be defined', () => {
    expect(imagesService).toBeDefined()
  })

  describe('findOrCreateImage', () => {
    test('should find image by url', async () => {
      const findImageByUrlSpy = vi
        .spyOn(imagesRepository, 'findImageByUrl')
        .mockResolvedValue(imageMock)
      const createImageSpy = vi.spyOn(imagesRepository, 'createImage')

      expect(await imagesService.findOrCreateImage(sdkImageMock)).toEqual(
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

      expect(await imagesService.findOrCreateImage(sdkImageMock)).toEqual(
        imageMock
      )
      expect(createImageSpy).toHaveBeenCalledWith(sdkImageMock)
      expect(findImageByUrlSpy).toHaveBeenCalledWith(sdkImageMock.url)
    })
  })

  test('should find or create images', async () => {
    const findOrCreateImageSpy = vi
      .spyOn(imagesService, 'findOrCreateImage')
      .mockResolvedValue(imageMock)

    expect(await imagesService.findOrCreateImages(sdkImagesMock)).toEqual(
      imagesMock
    )
    expect(findOrCreateImageSpy).toHaveBeenCalledTimes(sdkImagesMock.length)
  })
})
