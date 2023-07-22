import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { AuthenticationType } from '../enums'

export const ApiAuth = (authenticationType: AuthenticationType) =>
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
    ApiBearerAuth(authenticationType)
  )
