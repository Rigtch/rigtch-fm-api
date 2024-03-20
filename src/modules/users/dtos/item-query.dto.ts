import { MaxInt } from '@spotify/web-api-ts-sdk'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, Max } from 'class-validator'

export abstract class ItemQuery {
  @IsOptional()
  @IsNumber()
  @Max(50)
  @Transform(({ value }) => Number(value))
  readonly limit?: MaxInt<50>
}
