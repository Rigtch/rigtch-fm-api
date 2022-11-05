import { Field, ObjectType } from '@nestjs/graphql'

import { Image } from '.'

@ObjectType()
export abstract class Album {
  @Field(() => String)
  name: string

  @Field(() => String)
  artist: string

  @Field(() => [Image])
  images: Image[]
}
