import { ApiProperty } from '@nestjs/swagger'

import { SpotifyImage } from '@common/types/spotify'

export abstract class ImageDto implements SpotifyImage {
  @ApiProperty({ type: Number })
  height: number

  @ApiProperty({ type: Number })
  width: number

  @ApiProperty()
  url: string
}
