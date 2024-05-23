import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export function getRequestUser(data: unknown, context: ExecutionContext) {
  const request = context.switchToHttp().getRequest<Request>()

  return request.user!
}

export const RequestUser = createParamDecorator(getRequestUser)
