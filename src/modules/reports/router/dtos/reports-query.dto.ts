import { Transform } from 'class-transformer'
import { IsOptional, IsDate, IsEnum } from 'class-validator'

import { StatsMeasurement } from '@modules/stats/enums'

export class ReportsTotalItemsQuery {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly before?: Date

  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly after: Date
}

export class ReportsListeningQuery extends ReportsTotalItemsQuery {
  @IsOptional()
  @IsEnum(StatsMeasurement)
  readonly measurement?: StatsMeasurement
}
