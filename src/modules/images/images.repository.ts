import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Image } from './image.entity'
import { CreateImage } from './dtos'

@Injectable()
export class ImagesRepository extends Repository<Image> {
  constructor(private readonly dataSource: DataSource) {
    super(Image, dataSource.createEntityManager())
  }

  createImage(image: CreateImage) {
    const imageEntity = this.create(image)

    return this.save(imageEntity)
  }
}
