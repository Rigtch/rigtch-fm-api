import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { Request } from 'express'

import { UsersRepository } from '../users.repository'
import { User } from '../user.entity'

@Injectable()
export class UnFollowUserGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext) {
    const {
      user,
      body: { followerId },
    } = context.switchToHttp().getRequest<Request>()

    if (followerId === user!.id)
      throw new BadRequestException('You cannot follow yourself.')

    const follower: { following: User[] } | null =
      await this.usersRepository.findOne({
        where: {
          id: followerId as string,
        },
        relations: {
          following: true,
        },
        select: {
          following: true,
        },
      })

    if (!follower) return false

    if (!follower.following.some(({ id }) => id === user!.id))
      throw new BadRequestException('You are not following this user yet.')

    return true
  }
}
