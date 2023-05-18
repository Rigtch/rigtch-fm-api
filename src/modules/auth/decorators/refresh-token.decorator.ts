import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'

export const RefreshToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Request =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : GqlExecutionContext.create(context).getContext().req

    const refreshToken =
      request.cookies?.['refresh-token'] ??
      request.headers?.['Authorization']?.slice(6)

    if (!refreshToken)
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )

    return refreshToken
  }
)
