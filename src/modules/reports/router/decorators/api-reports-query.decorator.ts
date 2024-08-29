import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

import { StatsMeasurement } from '@modules/stats/enums'

export const ApiReportsTotalItemsQuery = () =>
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
    })
  )

export const ApiReportsListeningQuery = () =>
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
      name: 'measurement',
      type: String,
      required: false,
      enum: StatsMeasurement,
      description: 'The measurement to be used for the top tracks.',
    })
  )
