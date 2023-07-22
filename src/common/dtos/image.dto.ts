import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

import { SpotifyImage } from '~/common/types/spotify'

@ObjectType()
export abstract class ImageDto implements SpotifyImage {
  @Field(() => Number)
  @ApiProperty({ type: Number })
  height: number

  @Field(() => Number)
  @ApiProperty({ type: Number })
  width: number

  @Field(() => String)
  @ApiProperty()
  url: string
}
