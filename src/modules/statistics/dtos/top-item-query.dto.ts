import { IsEnum, IsOptional } from 'class-validator'

import { TimeRange } from '../enums'

import { ItemQuery } from './item-query.dto'

export abstract class TopItemQuery extends ItemQuery {
  @IsOptional()
  @IsEnum(TimeRange)
  timeRange?: TimeRange
}
