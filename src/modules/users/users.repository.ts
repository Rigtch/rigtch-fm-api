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

  createUser(createUser: CreateUser) {
    const userEntity = this.create({
      ...createUser,
      followers: [],
      following: [],
    })

    return this.save(userEntity)
  }

  async follow(userId: string, followerId: string) {
    const user = await this.findOne({
      where: { id: userId },
      relations: {
        followers: true,
        following: true,
      },
    })
    const follower = await this.findOne({
      where: { id: followerId },
      relations: {
        followers: true,
        following: true,
      },
    })

    if (!user || !follower) return

    if (user.followers.some(({ id }) => id === followerId)) return

    user.followers.push(follower)
    user.followersCount++
    await this.save(user)

    follower.following.push(user)
    follower.followingCount++
    await this.save(follower)

    return true
  }

  async unFollow(userId: string, followerId: string) {
    const user = await this.findOne({
      where: { id: userId },
      relations: {
        followers: true,
        following: true,
      },
    })
    const follower = await this.findOne({
      where: { id: followerId },
      relations: {
        followers: true,
        following: true,
      },
    })

    if (!user || !follower) return

    console.log(user.followers)

    console.log(user.followers.some(({ id }) => id === followerId))

    if (!user.followers.some(({ id }) => id === followerId)) return

    user.followers = user.followers.filter(({ id }) => id !== followerId)
    user.followersCount--
    await this.save(user)

    follower.following = follower.following.filter(({ id }) => id !== userId)
    follower.followingCount--
    await this.save(follower)

    return true
  }
}
