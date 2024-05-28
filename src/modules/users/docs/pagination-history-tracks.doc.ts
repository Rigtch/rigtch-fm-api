import { ApiProperty } from '@nestjs/swagger'

import { PaginationDocument } from '@common/docs'
import { HistoryTrack } from '@modules/history/tracks'

export abstract class PaginationHistoryTracksDocument extends PaginationDocument {
  @ApiProperty({ type: [HistoryTrack] })
  items: HistoryTrack[]
}
