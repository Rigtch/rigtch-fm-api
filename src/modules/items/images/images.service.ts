import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'

import { CreateImage } from './dtos'
import { Image } from './image.entity'

@Injectable()
export class ImagesService {
  async findOrCreate(sdkImages: CreateImage[], manager: EntityManager) {
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
