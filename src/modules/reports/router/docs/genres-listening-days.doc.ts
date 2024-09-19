import { ApiProperty } from '@nestjs/swagger'

export abstract class GenresListeningDaysDocument {
  @ApiProperty({
    type: Number,
    description: 'The day index.',
  })
  readonly dayIndex: number

  @ApiProperty({
    type: Number,
    description: 'Object with genre as key and value.',
  })
  readonly data: Record<string, number>

  @ApiProperty({
    type: Date,
    description: 'The date of the calculated day.',
  })
  readonly date: Date
}
