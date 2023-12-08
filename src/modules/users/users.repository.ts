import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { User } from './user.entity'
import { CreateUser } from './dtos'

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  findOneByDisplayName(displayName: string) {
    return this.findOne({
      where: { profile: { displayName } },
      relations: ['profile'],
    })
  }

  createUser(user: CreateUser) {
    const userEntity = this.create(user)

    return this.save(userEntity)
  }
}
