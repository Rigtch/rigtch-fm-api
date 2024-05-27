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
    ApiParam({ name: 'id', example: '2a348ca4-7a80-4f0f-b42a-c6c62a1145c6' }),
    ApiNotFoundResponse({
      description: NOT_BEEN_FOUND(USER),
    }),
    ApiBadRequestResponse({
      description: ONE_IS_INVALID('uuid'),
    })
  )
