import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { User } from './user.entity'
import { CreateUser } from './dtos'

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  findUsers() {
    return this.find({
      relations: ['profile'],
    })
  }

  findUserById(id: string) {
    return this.findOne({ where: { id }, relations: ['profile'] })
  }

  findUserByProfileId(profileId: string) {
    return this.findOne({
      where: { profile: { id: profileId } },
      relations: ['profile'],
    })
  }

  findUserByDisplayName(displayName: string) {
    return this.findOne({
      where: { profile: { displayName } },
      relations: ['profile'],
    })
  }

  createUser(user: CreateUser) {
    const userEntity = this.create(user)

    return this.save(userEntity)
  }

  async updateUser(id: string, user: Partial<CreateUser>) {
    const foundUser = await this.findUserById(id)

    Object.assign(foundUser, user)

    return this.save(foundUser)
  }

  async removeUser(id: string) {
    const user = await this.findUserById(id)

    return await this.remove(user)
  }
}
