import { ApiProperty } from '@nestjs/swagger'

import { TrackDocument } from './track.doc'

import { PaginationDocument } from '@common/docs'

export class PaginationTracksDocument extends PaginationDocument {
  @ApiProperty({ type: [TrackDocument] })
  items: TrackDocument[]
}
