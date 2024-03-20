import { IsNumber, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

import { ItemQuery } from './item-query.dto'

export abstract class LastItemQuery extends ItemQuery {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  readonly before?: number

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  readonly after?: number
}
