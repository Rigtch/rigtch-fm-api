import { IsOptional } from 'class-validator'

export abstract class ItemQuery {
  @IsOptional()
  limit?: number
}
