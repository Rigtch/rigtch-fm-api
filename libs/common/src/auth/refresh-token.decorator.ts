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

    console.log('cookies', request.cookies)
    console.log('body', request.body)
    console.log('headers', request.headers)

    const refreshToken = request.cookies['refresh-token']

    console.log('refreshToken', refreshToken)

    if (!refreshToken)
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )

    return refreshToken
  }
)
