import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Profile } from './profile.entity'

@Injectable()
export class ProfilesRepository extends Repository<Profile> {
  constructor(private readonly dataSource: DataSource) {
    super(Profile, dataSource.createEntityManager())
  }

  findProfiles() {
    return this.find({
      relations: ['images'],
    })
  }

  findProfile(id: string) {
    return this.findOne({ where: { id }, relations: ['images'] })
  }

  async createProfile(profile: Profile) {
    const profileEntity = this.create(profile)

    return await this.save(profileEntity)
  }

  async updateProfile(id: string, profile: Partial<Profile>) {
    const foundProfile = await this.findProfile(id)

    Object.assign(foundProfile, profile)

    return await this.save(foundProfile)
  }

  async removeProfile(id: string) {
    const profile = await this.findProfile(id)

    return await this.remove(profile)
  }
}
