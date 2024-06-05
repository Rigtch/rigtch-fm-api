import { ApiProperty, OmitType } from '@nestjs/swagger'

import { Album } from '../album.entity'

import { Artist } from '@modules/items/artists'

export class AlbumBaseDocument extends OmitType(Album, ['tracks', 'artists']) {
  @ApiProperty({
    type: [Artist],
    description:
      'The artists of the album. Each artist object includes a link in href to more detailed information about the artist.',
  })
  artists: Artist[]
}
