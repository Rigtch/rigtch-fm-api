import { ApiProperty } from '@nestjs/swagger'

import { Profile } from '../profile.entity'

import { SdkImage } from '@common/types/spotify'

export abstract class CreateProfile implements Omit<Profile, 'images'> {
  @ApiProperty()
  id: string

  @ApiProperty()
  displayName: string

  @ApiProperty()
  images?: SdkImage[]

  @ApiProperty({ type: Number })
  followers: number

  @ApiProperty({ nullable: true })
  country?: string

  @ApiProperty({ nullable: true })
  email?: string

  @ApiProperty()
  href: string

  @ApiProperty({ nullable: true })
  product?: string

  @ApiProperty()
  type: string

  @ApiProperty()
  uri: string
}
