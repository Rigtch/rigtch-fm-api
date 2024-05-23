import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'
import { Request } from 'express'

import { UsersRepository } from '../users.repository'
import { USER } from '../constants'

import { NOT_BEEN_FOUND } from '@common/constants'

@Injectable()
export class CheckUserIdGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const { id } = request.params

    const user = await this.usersRepository.findOneBy({ id })

    if (!user) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    request.user = user

    return true
  }
}
