import { ApiProperty } from '@nestjs/swagger'

import { AlbumBaseDocument } from '@modules/items/albums/docs'

export abstract class ArtistAlbumsDocument {
  @ApiProperty({
    type: [AlbumBaseDocument],
    description: 'The albums of the artist.',
  })
  albums: AlbumBaseDocument[]
}
