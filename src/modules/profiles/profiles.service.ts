import { Injectable } from '@nestjs/common'

import { ProfilesRepository } from './profiles.repository'
import { CreateProfile } from './dtos'

import { ImagesRepository } from '@modules/images'

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly imagesRepository: ImagesRepository
  ) {}

  create({ images, ...newProfile }: CreateProfile) {
    let imageEntities = []

    images.map(async image => {
      const newImage = await this.imagesRepository.createImage(image)

      imageEntities = [newImage]
    })

    return this.profilesRepository.createProfile({
      ...newProfile,
      images: imageEntities,
    })
  }
}
