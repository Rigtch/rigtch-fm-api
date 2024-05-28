import { ApiProperty } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'

import { PaginationMetaDocument } from './pagination-meta.doc'

export abstract class PaginationDocument
  implements Omit<Pagination<never>, 'items'>
{
  @ApiProperty({
    type: PaginationMetaDocument,
    description: 'Associated meta information (fe. itemCount).',
  })
  meta: PaginationMetaDocument
  links: {
    first?: string
    previous?: string
    next?: string
    last?: string
  }
}
