import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, In } from 'typeorm'

import { ImagesRepository } from './images.repository'
import { CreateImage } from './dtos'
import { Image } from './image.entity'

@Injectable()
export class ImagesService {
  constructor(
    private readonly imagesRepository: ImagesRepository,
    private readonly dataSource: DataSource
  ) {}

  create(newImage: CreateImage) {
    return this.imagesRepository.createImage(newImage)
  }

  public findOrCreate(data: CreateImage): Promise<Image>
  public findOrCreate(
    data: CreateImage[],
    manager?: EntityManager
  ): Promise<Image[]>

  async findOrCreate(
    data: CreateImage | CreateImage[],
    manager?: EntityManager
  ): Promise<Image | Image[]> {
    if (Array.isArray(data)) {
      if (manager) return this.findOrCreateManyInTransaction(data, manager)

      return this.findOrCreateMany(data)
    }

    return this.findOrCreateOne(data)
  }

  private async findOrCreateOne(image: CreateImage) {
    return this.dataSource.transaction(async manager => {
      const foundImage = await manager.findOneBy(Image, {
        url: image.url,
      })

      if (foundImage) return foundImage

      const imageEntity = manager.create(Image, image)

      return manager.save(imageEntity)
    })
  }

  private async findOrCreateMany(images: CreateImage[]) {
    if (images.length === 0) return [] as Image[]

    return Promise.all(images.map(image => this.findOrCreateOne(image)))
  }

  private async findOrCreateManyInTransaction(
    sdkImages: CreateImage[],
    manager: EntityManager
  ) {
    if (sdkImages.length === 0) return [] as Image[]

    const foundImages = await manager.findBy(Image, {
      url: In(sdkImages.map(image => image.url)),
    })
    const imagesToCreate = sdkImages.filter(
      ({ url }) => !foundImages.some(image => url === image.url)
    )

    const images = [...foundImages]

    if (imagesToCreate.length > 0) {
      const imagesEntities = manager.create(Image, imagesToCreate)
      const savedImages = await manager.save(imagesEntities)

      images.push(...savedImages)
    }

    return images
  }
}
