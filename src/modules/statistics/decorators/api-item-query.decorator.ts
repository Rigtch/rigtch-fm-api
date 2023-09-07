import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

import { TimeRange } from '../enums'

export interface ApiItemQueryOptions {
  withOffset?: boolean
  withCursors?: boolean
}

export const ApiItemQuery = (options?: ApiItemQueryOptions) =>
  applyDecorators(
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({ name: 'timeRange', enum: TimeRange, required: false }),
    options?.withOffset
      ? ApiQuery({ name: 'offset', type: Number, required: false })
      : () => {},
    options?.withCursors
      ? ApiQuery({ name: 'after', required: false })
      : () => {},
    options?.withCursors
      ? ApiQuery({ name: 'before', required: false })
      : () => {}
  )
