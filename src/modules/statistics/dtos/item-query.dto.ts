import { IsOptional, Max } from 'class-validator'

export abstract class ItemQuery {
  @IsOptional()
  @Max(50)
  limit?: number
}
