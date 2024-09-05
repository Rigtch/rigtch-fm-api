import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger'

import { USER } from '../constants'

import { NOT_BEEN_FOUND, ONE_IS_INVALID } from '@common/constants'

export const ApiUser = () =>
  applyDecorators(
    ApiParam({ name: 'id', example: '88b381b3-5dd8-4ccf-b962-72cb5b24d591' }),
    ApiNotFoundResponse({
      description: NOT_BEEN_FOUND(USER),
    }),
    ApiBadRequestResponse({
      description: ONE_IS_INVALID('uuid'),
    })
  )
