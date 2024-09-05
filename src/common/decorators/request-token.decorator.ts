import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { Environment } from '@config/environment'

export function getRequestToken(data: unknown, context: ExecutionContext) {
  const { headers, token, params } = context
    .switchToHttp()
    .getRequest<Request>()

  const configService = new ConfigService()

  if (params.id === configService.get<string>(Environment.PUBLIC_USER_ID))
    return ''

  const accessToken = headers.authorization?.slice(7)

  if (!accessToken)
    throw new UnauthorizedException('No value was provided for Authentication')

  return token!
}

export const RequestToken = createParamDecorator(getRequestToken)
