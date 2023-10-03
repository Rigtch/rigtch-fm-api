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

  findUser(id: string) {
    return this.findOne({ where: { id }, relations: ['profile'] })
  }

  async createUser(user: CreateUser) {
    const userEntity = this.create(user)

    return await this.save(userEntity)
  }

  async updateUser(id: string, user: Partial<CreateUser>) {
    const foundUser = await this.findUser(id)

    Object.assign(foundUser, user)

    return await this.save(foundUser)
  }

  async removeUser(id: string) {
    const user = await this.findUser(id)

    return await this.remove(user)
  }
}
