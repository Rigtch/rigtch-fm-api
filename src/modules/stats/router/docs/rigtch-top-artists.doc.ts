import { ApiProperty } from '@nestjs/swagger'

import { Artist } from '@modules/items/artists'

export abstract class RigtchTopArtistsDocument {
  @ApiProperty({
    type: [Artist],
    description: "One of user's top listened artist.",
  })
  item: Artist

  @ApiProperty({
    type: Number,
    description: 'The number of plays of the artist.',
  })
  plays?: number

  @ApiProperty({
    type: Number,
    description: 'The total duration of the artist.',
  })
  playTime?: number
}
