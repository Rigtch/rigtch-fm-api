import { ApiProperty } from '@nestjs/swagger'

export abstract class RigtchTopGenresDocument {
  @ApiProperty({
    type: [String],
    description: "One of user's top listened genre.",
  })
  item: string

  @ApiProperty({
    type: Number,
    description: 'The number of plays of the genre.',
  })
  plays?: number

  @ApiProperty({
    type: Number,
    description: 'The total duration of the genre.',
  })
  playTime?: number
}
