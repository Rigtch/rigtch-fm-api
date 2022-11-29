import { Field, ObjectType } from '@nestjs/graphql'

import { Album, TrackArtist } from '.'

import { FormattedTrack } from '@lib/common'

@ObjectType()
export abstract class Track implements FormattedTrack {
  @Field(() => String)
  name: string

  @Field(() => String)
  href: string

  @Field(() => [TrackArtist])
  artists: TrackArtist[]

  @Field(() => Album)
  album: Album

  @Field(() => Number)
  duration: number

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => String, { nullable: true })
  playedAt?: string
}
