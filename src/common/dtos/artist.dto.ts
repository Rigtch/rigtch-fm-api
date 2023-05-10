import { Field, ObjectType } from '@nestjs/graphql'

import { ImageDto } from '.'

import { FormattedArtist, FormattedTrackArtist } from '~/common/types/spotify'

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
