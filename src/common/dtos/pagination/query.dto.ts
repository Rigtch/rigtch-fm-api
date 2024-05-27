import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export abstract class PaginationQuery {
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Transform(({ value }) => (value ? Number.parseInt(value) : 10))
  limit?: number

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value ? Number.parseInt(value) : 1))
  page?: number
}
