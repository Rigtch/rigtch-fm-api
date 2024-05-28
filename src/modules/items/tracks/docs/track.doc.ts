import { ApiProperty } from '@nestjs/swagger'

import { TrackBaseDocument } from './track-base.doc'

import { Artist } from '@modules/items/artists'
import { AlbumBaseDocument } from '@modules/items/albums/docs/album-base.doc'

export class TrackDocument extends TrackBaseDocument {
  @ApiProperty({
    type: AlbumBaseDocument,
    description:
      'The album on which the track appears. The album object includes an externalId to get full information about the album.',
  })
  album: AlbumBaseDocument

  @ApiProperty({
    type: [Artist],
    description:
      'The artists who performed the track. Each artist object includes an externalId to get more detailed information about the artist.',
  })
  artists: Artist[]
}
