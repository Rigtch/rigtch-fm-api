import { ApiProperty } from '@nestjs/swagger'

import type { Track } from '@modules/items/tracks'
import { TrackDocument } from '@modules/items/tracks/docs'

export abstract class RigtchTopTracksDocument {
  @ApiProperty({
    type: [TrackDocument],
    description: "One of user's top listened track.",
  })
  item: Track

  @ApiProperty({
    type: Number,
    description: 'The number of plays of the track.',
  })
  plays?: number

  @ApiProperty({
    type: Number,
    description: 'The total duration of the track.',
  })
  playTime?: number
}
