import { Field, ObjectType } from '@nestjs/graphql'

import { SpotifyImage } from '../types'

@ObjectType()
export abstract class ImageDto implements SpotifyImage {
  @Field(() => Number)
  height: number

  @Field(() => Number)
  width: number

  @Field(() => String)
  url: string
}
