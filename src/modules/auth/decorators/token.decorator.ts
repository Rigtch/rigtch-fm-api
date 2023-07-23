import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'

export const Token = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Request =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : GqlExecutionContext.create(context).getContext().req

    const token = request.headers?.authorization?.slice(7)

    if (!token)
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )

    return token
  }
)
