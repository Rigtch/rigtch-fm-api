import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType()
export abstract class Genres {
  @Field(() => [String])
  @ApiProperty({ type: [String] })
  genres: string[]
}
