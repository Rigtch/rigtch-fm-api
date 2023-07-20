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

    const accessToken = request.headers?.authorization?.slice(7)

    if (!accessToken)
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )

    return accessToken
  }
)
