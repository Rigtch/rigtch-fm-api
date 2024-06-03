import { ApiProperty } from '@nestjs/swagger'

import { PageDocument } from './page.doc'

import { Artist } from '@modules/items/artists'

export abstract class ArtistsPageDocument extends PageDocument {
  @ApiProperty({
    type: [Artist],
  })
  items: Artist[]
}
