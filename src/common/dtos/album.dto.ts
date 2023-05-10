import { Field, ObjectType } from '@nestjs/graphql'

import { ImageDto } from '.'

@ObjectType()
export abstract class Album {
  @Field(() => String)
  name: string

  @Field(() => String)
  artist: string

  @Field(() => [ImageDto])
  images: ImageDto[]
}
