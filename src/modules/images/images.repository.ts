import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Image } from './image.entity'
import { CreateImage } from './dtos'

@Injectable()
export class ImagesRepository extends Repository<Image> {
  constructor(private readonly dataSource: DataSource) {
    super(Image, dataSource.createEntityManager())
  }

  findImages() {
    return this.find()
  }

  findImage(id: string) {
    return this.findOneBy({ id })
  }

  async createImage(image: CreateImage) {
    const imageEntity = this.create(image)

    return await this.save(imageEntity)
  }

  async updateImage(id: string, image: Partial<CreateImage>) {
    const foundImage = await this.findOneBy({ id })

    Object.assign(foundImage, image)

    return await this.save(foundImage)
  }

  async removeImage(id: string) {
    const image = await this.findOneBy({ id })

    return await this.remove(image)
  }
}
