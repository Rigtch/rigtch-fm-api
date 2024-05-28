import { ApiProperty } from '@nestjs/swagger'

import { AlbumBaseDocument } from './album-base.doc'

import { Artist } from '@modules/items/artists'
import { TrackBaseDocument } from '@modules/items/tracks/docs'

export class AlbumDocument extends AlbumBaseDocument {
  @ApiProperty({
    type: [TrackBaseDocument],
    description: 'The tracks of the album.',
  })
  tracks?: TrackBaseDocument[]

  @ApiProperty({
    type: [Artist],
    description:
      'The artists of the album. Each artist object includes a link in href to more detailed information about the artist.',
  })
  artists: Artist[]
}
