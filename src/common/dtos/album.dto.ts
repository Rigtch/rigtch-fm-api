import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

import { ImageDto } from '.'

@ObjectType()
export abstract class Album {
  @Field(() => String)
  @ApiProperty()
  name: string

  @Field(() => String)
  @ApiProperty()
  artist: string

  @Field(() => [ImageDto])
  @ApiProperty({ type: [ImageDto] })
  images: ImageDto[]
}
