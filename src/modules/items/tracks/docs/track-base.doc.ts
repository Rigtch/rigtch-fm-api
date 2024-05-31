import { ApiProperty, OmitType } from '@nestjs/swagger'

import { Track } from '../track.entity'

import { Artist } from '@modules/items/artists'

export class TrackBaseDocument extends OmitType(Track, [
  'album',
  'artists',
  'historyTracks',
]) {
  @ApiProperty({
    type: [Artist],
    description:
      'The artists who performed the track. Each artist object includes an externalId to get more detailed information about the artist.',
  })
  artists: Artist[]
}
