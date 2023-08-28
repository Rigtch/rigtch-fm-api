import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

import { TimeRange } from '../enums'

export const ApiItemQuery = (isTopItem = false) =>
  applyDecorators(
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({ name: 'timeRange', enum: TimeRange, required: false }),
    isTopItem
      ? ApiQuery({ name: 'offset', type: Number, required: false })
      : () => {}
  )
