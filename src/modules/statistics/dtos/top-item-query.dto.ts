import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

import { TimeRange } from '../enums'

import { ItemQuery } from './item-query.dto'

export abstract class TopItemQuery extends ItemQuery {
  @IsOptional()
  @IsEnum(TimeRange)
  timeRange?: TimeRange

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  offset?: number
}
