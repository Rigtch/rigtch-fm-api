import { ApiProperty } from '@nestjs/swagger'

import { PaginationResponse } from '@common/dtos/pagination'
import { HistoryTrack } from '@modules/history/tracks'

export abstract class PaginationHistoryTracks extends PaginationResponse {
  @ApiProperty({ type: [HistoryTrack] })
  items: HistoryTrack[]
}
