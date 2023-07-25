import { ApiProperty } from '@nestjs/swagger'

import { ImageDto } from '.'

export abstract class Album {
  @ApiProperty()
  name: string

  @ApiProperty()
  artist: string

  @ApiProperty({ type: [ImageDto] })
  images: ImageDto[]
}
