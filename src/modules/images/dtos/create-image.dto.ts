import { ApiProperty } from '@nestjs/swagger'

import { Image } from '../image.entity'

export abstract class CreateImage implements Omit<Image, 'id'> {
  @ApiProperty({ type: Number })
  height: number

  @ApiProperty({ type: Number })
  width: number

  @ApiProperty()
  url: string
}
