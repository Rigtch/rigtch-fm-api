import { Test } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { ImagesRepository } from './images.repository'

import {
  imageMock,
  imagesMock,
  sdkImageMock,
  sdkImagesMock,
} from '@common/mocks'

describe('ImagesRepository', () => {
  let imagesRepository: ImagesRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

    imagesRepository = module.get(ImagesRepository)
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
      const findOneSpy = vi
        .spyOn(imagesRepository, 'findOne')
        .mockResolvedValue(imageMock)
      const createImageSpy = vi.spyOn(imagesRepository, 'createImage')

      expect(await imagesRepository.findOrCreateImage(sdkImageMock)).toEqual(
        imageMock
      )
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { url: sdkImageMock.url },
      })
      expect(createImageSpy).not.toHaveBeenCalled()
    })

    test('should create image', async () => {
      vi.spyOn(imagesRepository, 'findOne').mockResolvedValue(null)
      const createImageSpy = vi
        .spyOn(imagesRepository, 'createImage')
        .mockResolvedValue(imageMock)
      const findOneSpy = vi.spyOn(imagesRepository, 'findOne')

      expect(await imagesRepository.findOrCreateImage(sdkImageMock)).toEqual(
        imageMock
      )
      expect(createImageSpy).toHaveBeenCalledWith(sdkImageMock)
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { url: sdkImageMock.url },
      })
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
