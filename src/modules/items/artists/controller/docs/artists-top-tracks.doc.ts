import { ApiProperty } from '@nestjs/swagger'

import { TrackBaseDocument } from '@modules/items/tracks/docs'

export abstract class ArtistsTopTracksDocument {
  @ApiProperty({
    type: [TrackBaseDocument],
    description: 'The top tracks of the artist.',
  })
  tracks: TrackBaseDocument[]
}
