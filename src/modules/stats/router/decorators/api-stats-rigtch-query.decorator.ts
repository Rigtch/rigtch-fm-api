import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

import { StatsMeasurement } from '@modules/stats/enums'

export const ApiStatsRigtchQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'before',
      required: false,
      type: Date,
      description: 'The date before which the user listened to the tracks.',
    }),
    ApiQuery({
      name: 'after',
      type: Date,
      description: 'The date after which the user listened to the tracks.',
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'The amount of tracks to be returned.',
    }),
    ApiQuery({
      name: 'offset',
      type: Number,
      required: false,
      description: 'The offset of the items returned.',
    }),
    ApiQuery({
      name: 'measurement',
      type: String,
      required: false,
      enum: StatsMeasurement,
      description: 'The measurement to be used for the top tracks.',
    })
  )
