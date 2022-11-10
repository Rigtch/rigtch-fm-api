import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'

export const AccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Request =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : GqlExecutionContext.create(context).getContext().req

    const authorization = request.headers?.authorization

    if (!authorization?.slice(7))
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )

    if (authorization?.slice(0, 6).toLowerCase() !== 'bearer')
      throw new UnauthorizedException('Invalid Authentication Type')

    return authorization?.slice(7)
  }
)
