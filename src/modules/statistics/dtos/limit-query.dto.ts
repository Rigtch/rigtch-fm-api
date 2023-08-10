import { IsOptional, Max } from 'class-validator'

export abstract class LimitQuery {
  @IsOptional()
  @Max(50)
  limit?: number
}
