import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { ImagesRepository } from './images.repository'

import { imageMock, spotifyImageMock } from '@common/mocks'

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

  test('should create image', async () => {
    vi.spyOn(imagesRepository, 'create').mockReturnValue(imageMock)
    vi.spyOn(imagesRepository, 'save').mockResolvedValue(imageMock)

    const image = await imagesRepository.createImage(spotifyImageMock)

    expect(image).toEqual(imageMock)
    expect(imagesRepository.create).toHaveBeenCalledWith(spotifyImageMock)
    expect(imagesRepository.save).toHaveBeenCalledWith(imageMock)
  })
})
