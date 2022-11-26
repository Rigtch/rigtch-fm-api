import { Field, ObjectType } from '@nestjs/graphql'

import { Album } from '.'

import { FormattedTrack } from '@lib/common'

@ObjectType()
export abstract class Track implements FormattedTrack {
  @Field(() => String)
  name: string

  @Field(() => String)
  href: string

  @Field(() => [String])
  artists: string[]

  @Field(() => Album)
  album: Album

  @Field(() => Number)
  duration: number

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => String, { nullable: true })
  playedAt?: string
}
