import { ApiProperty } from '@nestjs/swagger'
import { Page } from '@spotify/web-api-ts-sdk'

export abstract class PageDocument implements Omit<Page<unknown>, 'items'> {
  @ApiProperty({
    type: Number,
    nullable: true,
    example: 10,
    description:
      'The maximum number of items in the response (as set in the query or by default).',
  })
  readonly limit: number

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 1,
    description:
      'The offset of the items returned (as set in the query or by default)',
  })
  readonly offset: number

  @ApiProperty({
    example: 10,
    description: 'The total amount of items.',
  })
  readonly total: number

  readonly href: string
  readonly next: string
  readonly previous: string
}
