import { ApiProperty } from '@nestjs/swagger'

import { Profile } from '../profile.entity'

import { CreateImage } from '@modules/images/dtos'

export abstract class CreateProfile implements Omit<Profile, 'images'> {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly displayName: string

  @ApiProperty()
  readonly images?: CreateImage[]

  @ApiProperty({ type: Number })
  readonly followers: number

  @ApiProperty({ nullable: true })
  readonly country?: string

  @ApiProperty({ nullable: true })
  readonly email?: string

  @ApiProperty()
  readonly href: string

  @ApiProperty({ nullable: true })
  readonly product?: string

  @ApiProperty()
  readonly type: string

  @ApiProperty()
  readonly uri: string
}
