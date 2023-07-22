import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

import { ImageDto } from '@common/dtos'
import { FormattedProfile } from '@common/types/spotify'

@ObjectType()
export abstract class ProfileDto implements FormattedProfile {
  @Field(() => String)
  @ApiProperty()
  id: string

  @Field(() => String)
  @ApiProperty()
  displayName: string

  @Field(() => [ImageDto])
  @ApiProperty({ type: [ImageDto] })
  images: ImageDto[]

  @Field(() => Number)
  @ApiProperty({ type: Number })
  followers: number

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  country?: string

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  email?: string

  @Field(() => String)
  @ApiProperty()
  href: string
}
