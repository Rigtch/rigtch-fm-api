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

    console.log('cookies', request.cookies)
    console.log('body', request.body)
    console.log('headers', request.headers)

    const accessToken = request.cookies['access-token']

    console.log('accessToken', accessToken)

    if (!accessToken)
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )

    return accessToken
  }
)
