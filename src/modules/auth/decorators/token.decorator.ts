import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

export function getToken(data: unknown, context: ExecutionContext) {
  const { headers }: Request = context.switchToHttp().getRequest()

  const token = headers.authorization?.slice(7)

  if (!token)
    throw new UnauthorizedException('No value was provided for Authentication')

  return token
}

export const Token = createParamDecorator(getToken)
