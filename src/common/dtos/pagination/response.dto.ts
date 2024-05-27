import { ApiProperty } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'

import { PaginationMeta } from './meta.dto'

export abstract class PaginationResponse
  implements Omit<Pagination<never>, 'items'>
{
  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta
  links: {
    first?: string
    previous?: string
    next?: string
    last?: string
  }
}
