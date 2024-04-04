import { Injectable } from '@nestjs/common'

import { ImagesRepository } from './images.repository'
import { CreateImage } from './dtos'

@Injectable()
export class ImagesService {
  constructor(private readonly imagesRepository: ImagesRepository) {}

  async findOrCreateImage(image: CreateImage) {
    const foundImage = await this.imagesRepository.findImageByUrl(image.url)

    if (foundImage) return foundImage

    return this.imagesRepository.createImage(image)
  }

  async findOrCreateImages(images?: CreateImage[]) {
    if (!images || images.length === 0) return []

    return Promise.all(
      images.map(image => {
        return this.findOrCreateImage(image)
      })
    )
  }
}
