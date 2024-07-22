import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Request } from 'express'

import { BETA_USER_CREATED_AT } from '@modules/users/constants'

export class TimeRangeGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { user, query } = context.switchToHttp().getRequest<Request>()

    if (!user) return false

    if (typeof query.after !== 'string') return false

    if (new Date(user.createdAt).getTime() < BETA_USER_CREATED_AT.getTime())
      return true

    if (new Date(query.after).getTime() <= BETA_USER_CREATED_AT.getTime())
      throw new ForbiddenException(
        'User was created after requested time range.'
      )

    return true
  }
}
