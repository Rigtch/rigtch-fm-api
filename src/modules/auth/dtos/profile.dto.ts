import { ApiProperty } from '@nestjs/swagger'

import { ImageDto } from '@common/dtos'
import { FormattedProfile } from '@common/types/spotify'

export abstract class ProfileDto implements FormattedProfile {
  @ApiProperty()
  id: string

  @ApiProperty()
  displayName: string

  @ApiProperty({ type: [ImageDto] })
  images: ImageDto[]

  @ApiProperty({ type: Number })
  followers: number

  @ApiProperty({ required: false })
  country?: string

  @ApiProperty({ required: false })
  email?: string

  @ApiProperty()
  href: string
}
