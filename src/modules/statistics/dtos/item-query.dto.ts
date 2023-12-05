import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, Max } from 'class-validator'

export abstract class ItemQuery {
  @IsOptional()
  @IsNumber()
  @Max(50)
  @Transform(({ value }) => Number(value))
  limit?: number
}
