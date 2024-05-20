import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

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
  public findOrCreate(data: CreateImage[]): Promise<Image[]>

  async findOrCreate(
    data: CreateImage | CreateImage[]
  ): Promise<Image | Image[]> {
    if (Array.isArray(data)) return this.findOrCreateMany(data)

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

  private findOrCreateMany(images: CreateImage[]) {
    if (images.length === 0) return []

    return Promise.all(images.map(image => this.findOrCreateOne(image)))
  }
}
