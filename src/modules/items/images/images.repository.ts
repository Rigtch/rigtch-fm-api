import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Image } from './image.entity'
import { CreateImage } from './dtos'

@Injectable()
export class ImagesRepository extends Repository<Image> {
  constructor(private readonly dataSource: DataSource) {
    super(Image, dataSource.createEntityManager())
  }

  findImageByUrl(url: string) {
    return this.findOne({ where: { url } })
  }

  createImage(image: CreateImage) {
    const imageEntity = this.create(image)

    return this.save(imageEntity)
  }

  async findOrCreateImage(image: CreateImage) {
    const foundImage = await this.findImageByUrl(image.url)

    if (foundImage) return foundImage

    return this.createImage(image)
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
