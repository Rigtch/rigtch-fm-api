import { ApiProperty } from '@nestjs/swagger'

import type { Album } from '@modules/items/albums'
import { AlbumDocument } from '@modules/items/albums/docs'

export abstract class RigtchTopAlbumsDocument {
  @ApiProperty({
    type: [AlbumDocument],
    description: "One of user's top listened album.",
  })
  item: Album

  @ApiProperty({
    type: Number,
    description: 'The number of plays of the album.',
  })
  plays?: number

  @ApiProperty({
    type: Number,
    description: 'The total duration of the album.',
  })
  playTime?: number
}
