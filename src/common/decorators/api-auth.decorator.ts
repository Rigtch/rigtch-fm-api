import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { BEARER } from '../constants'

export const ApiAuth = () =>
  applyDecorators(
    ApiUnauthorizedResponse({
      description: 'The access token expired',
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid access token',
    }),
    ApiUnauthorizedResponse({
      description: 'No value was provided for Authentication',
    }),
    ApiBearerAuth(BEARER)
  )
