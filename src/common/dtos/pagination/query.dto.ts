import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export abstract class PaginationQuery {
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Transform(({ value }) => (value ? Number.parseInt(value) : 10))
  @ApiProperty({
    type: Number,
    nullable: true,
    example: 10,
    description: 'The amount of items to be requested per page.',
  })
  limit?: number

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value ? Number.parseInt(value) : 1))
  @ApiProperty({
    type: Number,
    nullable: true,
    example: 1,
    description: 'The page that is requested.',
  })
  page?: number
}
