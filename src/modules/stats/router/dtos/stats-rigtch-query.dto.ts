import { Transform } from 'class-transformer'
import { IsDate, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator'

import { StatsMeasurement } from '@modules/stats/enums'

export class StatsRigtchQuery {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly before?: Date

  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly after: Date

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(1)
  @Transform(({ value }: { value: number }) =>
    value > 100 ? 100 : value > 0 ? value : 1
  )
  readonly limit?: number

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Transform(({ value }: { value: number }) => (value > 100 ? 100 : value))
  readonly offset?: number

  @IsOptional()
  @IsEnum(StatsMeasurement)
  readonly measurement?: StatsMeasurement
}
