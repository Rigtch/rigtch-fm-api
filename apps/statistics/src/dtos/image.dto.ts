import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export abstract class Image {
  @Field(() => Number)
  height: number

  @Field(() => Number)
  width: number

  @Field(() => String)
  url: string
}
