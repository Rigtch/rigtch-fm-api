import { ApiProperty } from '@nestjs/swagger'

import { PageDocument } from './page.doc'

import { TrackDocument } from '@modules/items/tracks/docs'

export abstract class TracksPageDocument extends PageDocument {
  @ApiProperty({
    type: [TrackDocument],
  })
  tracks: TrackDocument[]
}
