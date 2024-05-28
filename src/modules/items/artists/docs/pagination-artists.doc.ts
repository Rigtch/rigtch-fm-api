import { ApiProperty } from '@nestjs/swagger'

import { Artist } from '../artist.entity'

import { PaginationDocument } from '@common/docs'

export class PaginationArtistsDocument extends PaginationDocument {
  @ApiProperty({ type: [Artist] })
  items: Artist[]
}
