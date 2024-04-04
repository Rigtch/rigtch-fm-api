import { Injectable } from '@nestjs/common'

import { ImagesRepository } from './images.repository'
import { CreateImage } from './dtos'
import { Image } from './image.entity'

import { ItemService } from '@common/abstractions'

@Injectable()
export class ImagesService implements ItemService<CreateImage, Image> {
  constructor(private readonly imagesRepository: ImagesRepository) {}

  create(data: CreateImage) {
    return this.findOrCreateImage(data)
  }

  public findOrCreate(data: CreateImage): Promise<Image>
  public findOrCreate(data: CreateImage[]): Promise<Image[]>

  async findOrCreate(
    data: CreateImage | CreateImage[]
  ): Promise<Image | Image[]> {
    if (Array.isArray(data)) return this.findOrCreateImages(data)

    return this.findOrCreateImage(data)
  }

  async findOrCreateImage(image: CreateImage) {
    const foundImage = await this.imagesRepository.findImageByUrl(image.url)

    if (foundImage) return foundImage

    return this.imagesRepository.createImage(image)
  }

  async findOrCreateImages(images: CreateImage[]) {
    if (images.length === 0) return []

    return Promise.all(
      images.map(image => {
        return this.findOrCreateImage(image)
      })
    )
  }
}
