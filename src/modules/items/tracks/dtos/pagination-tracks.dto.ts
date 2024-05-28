import { ApiProperty } from '@nestjs/swagger'

import { Track } from '../track.entity'

import { PaginationResponse } from '@common/dtos/pagination'

export abstract class PaginationTracks extends PaginationResponse {
  @ApiProperty({ type: [Track] })
  items: Track[]
}
