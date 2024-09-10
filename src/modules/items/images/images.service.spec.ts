import { Test, TestingModule } from '@nestjs/testing'
import { EntityManager, In } from 'typeorm'
import { MockInstance } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

import { Image } from './image.entity'
import { ImagesService } from './images.service'

import { entityManagerFactoryMock } from '@common/mocks'
import { SdkImage } from '@common/types/spotify'

describe('ImagesService', () => {
  let moduleRef: TestingModule
  let imagesService: ImagesService
  let entityManagerMock: EntityManager

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile()

    imagesService = moduleRef.get(ImagesService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(imagesService).toBeDefined()
  })

  describe('findOrCreate', () => {
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
