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
    return this.find()
  }

  findUserByProfileId(profileId: string) {
    return this.findOne({
      where: { profile: { id: profileId } },
    })
  }

  createUser(user: CreateUser) {
    const userEntity = this.create(user)

    return this.save(userEntity)
  }
}
