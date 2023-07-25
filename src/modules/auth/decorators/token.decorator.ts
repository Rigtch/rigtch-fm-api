import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

export const Token = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest()

    const token = request.headers?.authorization?.slice(7)

    if (!token)
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )

    return token
  }
)
