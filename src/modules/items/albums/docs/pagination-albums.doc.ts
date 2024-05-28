import { ApiProperty } from '@nestjs/swagger'

import { AlbumDocument } from './album.doc'

import { PaginationDocument } from '@common/docs'

export class PaginationAlbumsDocument extends PaginationDocument {
  @ApiProperty({ type: [AlbumDocument] })
  items: AlbumDocument[]
}
