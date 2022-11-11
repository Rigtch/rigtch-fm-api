import { Field, ObjectType } from '@nestjs/graphql'

import { FormattedArtist, ImageDto } from '@lib/common'

@ObjectType()
export abstract class Artist implements FormattedArtist {
  @Field(() => String)
  name: string

  @Field(() => [String])
  genres: string[]

  @Field(() => String)
  href: string

  @Field(() => [ImageDto])
  images: ImageDto[]
}
