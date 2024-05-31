import { ApiProperty } from '@nestjs/swagger'

import { TrackBaseDocument } from './track-base.doc'

import { AlbumBaseDocument } from '@modules/items/albums/docs/album-base.doc'

export class TrackDocument extends TrackBaseDocument {
  @ApiProperty({
    type: AlbumBaseDocument,
    description:
      'The album on which the track appears. The album object includes an externalId to get full information about the album.',
  })
  album: AlbumBaseDocument
}
