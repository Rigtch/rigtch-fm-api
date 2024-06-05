import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

export function getRequestToken(data: unknown, context: ExecutionContext) {
  const { headers, token } = context.switchToHttp().getRequest<Request>()

  const accessToken = headers.authorization?.slice(7)

  if (!accessToken)
    throw new UnauthorizedException('No value was provided for Authentication')

  return token!
}

export const RequestToken = createParamDecorator(getRequestToken)
