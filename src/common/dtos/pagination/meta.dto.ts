import { ApiProperty } from '@nestjs/swagger'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'

export abstract class PaginationMeta implements IPaginationMeta {
  @ApiProperty({
    example: 10,
    description: 'The amount of items on this specific page.',
  })
  itemCount: number

  @ApiProperty({
    example: 10,
    description: 'The total amount of items.',
  })
  totalItems: number

  @ApiProperty({
    example: 10,
    description: 'The amount of items that were requested per page.',
  })
  itemsPerPage: number

  @ApiProperty({
    example: 1,
    description: 'The total amount of pages in this paginator',
  })
  totalPages: number

  @ApiProperty({
    example: 1,
    description: 'The current page this paginator "points" to.',
  })
  currentPage: number
}
