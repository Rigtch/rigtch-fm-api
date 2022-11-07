import { Field, ObjectType } from '@nestjs/graphql'

import { SpotifyImage } from '@lib/common'

@ObjectType()
export abstract class Image implements SpotifyImage {
  @Field(() => Number)
  height: number

  @Field(() => Number)
  width: number

  @Field(() => String)
  url: string
}
