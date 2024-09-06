import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

import { EnvService } from '@config/env'

export function getRequestToken(data: unknown, context: ExecutionContext) {
  const { headers, token, params } = context
    .switchToHttp()
    .getRequest<Request>()

  const envService = new EnvService(new ConfigService())

  if (params.id === envService.get('PUBLIC_USER_ID')) return token!

  const accessToken = headers.authorization?.slice(7)

  if (!accessToken)
    throw new UnauthorizedException('No value was provided for Authentication')

  return token!
}

export const RequestToken = createParamDecorator(getRequestToken)
