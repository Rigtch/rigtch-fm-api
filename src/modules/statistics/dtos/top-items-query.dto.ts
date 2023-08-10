import { IsEnum, IsOptional } from 'class-validator'

import { TimeRange } from '../enums'

import { LimitQuery } from './limit-query.dto'

export abstract class TopItemsQuery extends LimitQuery {
  @IsOptional()
  @IsEnum(TimeRange)
  timeRange?: TimeRange
}
