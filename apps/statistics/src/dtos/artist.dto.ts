import { Field, ObjectType } from '@nestjs/graphql'

import { FormattedArtist } from '../types'

import { Image } from '.'

@ObjectType()
export abstract class Artist implements FormattedArtist {
  @Field(() => String)
  name: string

  @Field(() => [String])
  genres: string[]

  @Field(() => String)
  href: string

  @Field(() => [Image])
  images: Image[]
}
