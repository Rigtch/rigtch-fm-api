import { Field, ObjectType } from '@nestjs/graphql'

import { FormattedTrack } from '../types'

import { Album } from '.'

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
}
