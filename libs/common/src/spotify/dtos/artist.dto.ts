import { Field, ObjectType } from '@nestjs/graphql'

import { FormattedArtist, FormattedTrackArtist, ImageDto } from '@lib/common'

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

@ObjectType()
export abstract class TrackArtist implements FormattedTrackArtist {
  @Field(() => String)
  name: string

  @Field(() => String)
  id: string

  @Field(() => String)
  href: string
}
