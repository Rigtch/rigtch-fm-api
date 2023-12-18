import { Injectable } from '@nestjs/common'

import { ProfilesRepository } from './profiles.repository'
import { CreateProfile } from './dtos'

import { ImagesRepository, Image } from '@modules/images'

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly imagesRepository: ImagesRepository
  ) {}

  async create({ images, ...newProfile }: CreateProfile) {
    const imageEntities: Image[] = []

    if (images && images.length > 0) {
      for (const image of images) {
        const newImage = await this.imagesRepository.createImage(image)

        imageEntities.push(newImage)
      }
    }

    return this.profilesRepository.createProfile({
      ...newProfile,
      images: imageEntities,
    })
  }
}
