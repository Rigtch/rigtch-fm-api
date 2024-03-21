import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export const ApiPaginatedQuery = () =>
  applyDecorators(
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({ name: 'page', type: Number, required: false })
  )
