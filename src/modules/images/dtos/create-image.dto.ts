import { ApiProperty } from '@nestjs/swagger'

import { SdkImage } from '@common/types/spotify'

export abstract class CreateImage implements SdkImage {
  @ApiProperty({ type: Number })
  height: number

  @ApiProperty({ type: Number })
  width: number

  @ApiProperty()
  url: string
}
