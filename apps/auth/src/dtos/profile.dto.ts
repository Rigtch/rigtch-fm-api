import { Field, ObjectType } from '@nestjs/graphql'

import { FormattedProfile, ImageDto } from '@lib/common'

@ObjectType()
export abstract class ProfileDto implements FormattedProfile {
  @Field(() => String)
  id: string

  @Field(() => String)
  displayName: string

  @Field(() => [ImageDto])
  images: ImageDto[]

  @Field(() => Number)
  followers: number

  @Field(() => String, { nullable: true })
  country?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String)
  href: string
}
