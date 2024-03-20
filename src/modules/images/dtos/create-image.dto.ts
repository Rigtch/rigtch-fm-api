import { ApiProperty } from '@nestjs/swagger'

import { SdkImage } from '@common/types/spotify'

export abstract class CreateImage implements SdkImage {
  @ApiProperty({ type: Number })
  readonly height: number

  @ApiProperty({ type: Number })
  readonly width: number

  @ApiProperty()
  readonly url: string
}
