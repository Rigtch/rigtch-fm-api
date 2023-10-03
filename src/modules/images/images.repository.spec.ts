import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { ImagesRepository } from './images.repository'

import { imageMock, imagesMock, spotifyImageMock } from '@common/mocks'

describe('ImagesRepository', () => {
  let imagesRepository: ImagesRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    imagesRepository = module.get<ImagesRepository>(ImagesRepository)
  })

  test('should be defined', () => {
    expect(imagesRepository).toBeDefined()
  })

  test('should find all images', async () => {
    vi.spyOn(imagesRepository, 'find').mockResolvedValue(imagesMock)

    const images = await imagesRepository.findImages()

    expect(images).toEqual(imagesMock)
    expect(imagesRepository.find).toHaveBeenCalled()
  })

  test('should find image by id', async () => {
    vi.spyOn(imagesRepository, 'findOneBy').mockResolvedValue(imageMock)

    const id = '1'
    const image = await imagesRepository.findImage(id)

    expect(image).toEqual(imageMock)
    expect(imagesRepository.findOneBy).toHaveBeenCalledWith({ id })
  })

  test('should create image', async () => {
    vi.spyOn(imagesRepository, 'create').mockReturnValue(imageMock)
    vi.spyOn(imagesRepository, 'save').mockResolvedValue(imageMock)

    const image = await imagesRepository.createImage(spotifyImageMock)

    expect(image).toEqual(imageMock)
    expect(imagesRepository.create).toHaveBeenCalledWith(spotifyImageMock)
    expect(imagesRepository.save).toHaveBeenCalledWith(imageMock)
  })

  test('should update image', async () => {
    vi.spyOn(imagesRepository, 'findOneBy').mockResolvedValue(imageMock)
    vi.spyOn(imagesRepository, 'save').mockResolvedValue(imageMock)

    const id = '1'
    const image = await imagesRepository.updateImage(id, spotifyImageMock)

    expect(image).toEqual(imageMock)
    expect(imagesRepository.findOneBy).toHaveBeenCalledWith({ id })
    expect(imagesRepository.save).toHaveBeenCalledWith(imageMock)
  })

  test('should remove image', async () => {
    vi.spyOn(imagesRepository, 'findOneBy').mockResolvedValue(imageMock)
    vi.spyOn(imagesRepository, 'remove').mockResolvedValue(imageMock)

    const id = '1'
    const image = await imagesRepository.removeImage(id)

    expect(image).toEqual(imageMock)
    expect(imagesRepository.findOneBy).toHaveBeenCalledWith({ id })
    expect(imagesRepository.remove).toHaveBeenCalledWith(imageMock)
  })
})
