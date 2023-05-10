import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export abstract class Genres {
  @Field(() => [String])
  genres: string[]
}
