import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Profile } from './profile.entity'

@Injectable()
export class ProfilesRepository extends Repository<Profile> {
  constructor(private readonly dataSource: DataSource) {
    super(Profile, dataSource.createEntityManager())
  }

  createProfile(profile: Profile) {
    const profileEntity = this.create(profile)

    return this.save(profileEntity)
  }
}
