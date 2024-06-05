import { ApiProperty } from '@nestjs/swagger'

import { AlbumBaseDocument } from './album-base.doc'

import { TrackBaseDocument } from '@modules/items/tracks/docs'

export class AlbumDocument extends AlbumBaseDocument {
  @ApiProperty({
    type: [TrackBaseDocument],
    description: 'The tracks of the album.',
  })
  tracks?: TrackBaseDocument[]
}
