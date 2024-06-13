import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger'

import { API_ARTIST_ID_EXAMPLE } from '../../constants'

import { NOT_BEEN_FOUND, ONE_IS_INVALID } from '@common/constants'

export const ApiArtist = () =>
  applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      example: API_ARTIST_ID_EXAMPLE,
    }),
    ApiNotFoundResponse({
      description: NOT_BEEN_FOUND('artist'),
    }),
    ApiBadRequestResponse({
      description: ONE_IS_INVALID('uuid'),
    })
  )
