import { ApiProperty } from '@nestjs/swagger'

export abstract class ListeningDaysDocument {
  @ApiProperty({
    type: Number,
    description: 'The day index.',
  })
  readonly dayIndex: number

  @ApiProperty({
    type: Number,
    description: 'The value of the day either in plays or play time.',
  })
  readonly value: number

  @ApiProperty({
    type: Date,
    description: 'The date of the calculated day.',
  })
  readonly date: Date
}
