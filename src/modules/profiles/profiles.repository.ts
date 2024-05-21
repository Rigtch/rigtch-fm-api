import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Profile } from './profile.entity'
import { CreateProfile } from './dtos'

import { ImagesRepository } from '@modules/items/images'

@Injectable()
export class ProfilesRepository extends Repository<Profile> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly imagesRepository: ImagesRepository
  ) {
    super(Profile, dataSource.createEntityManager())
  }

  async createProfile({ images, ...profile }: CreateProfile) {
    const imageEntities = await this.imagesRepository.findOrCreateImages(images)

    const profileEntity = this.create({
      ...profile,
      images: imageEntities,
    })

    return this.save(profileEntity)
  }
}
