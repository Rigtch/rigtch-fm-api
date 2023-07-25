import { ApiProperty } from '@nestjs/swagger'

export abstract class Genres {
  @ApiProperty({ type: [String] })
  genres: string[]
}
