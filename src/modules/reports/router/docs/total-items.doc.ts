import { ApiProperty } from '@nestjs/swagger'

export abstract class TotalItemsDocument {
  @ApiProperty({
    type: Number,
    description: 'The total amount of items.',
  })
  total: number
}
