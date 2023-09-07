import { IsNumber, IsOptional } from 'class-validator'

import { ItemQuery } from './item-query.dto'

export abstract class LastItemQuery extends ItemQuery {
  @IsOptional()
  @IsNumber()
  before?: string

  @IsOptional()
  @IsNumber()
  after?: string
}
