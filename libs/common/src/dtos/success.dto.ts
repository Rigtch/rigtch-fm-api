import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export abstract class Success {
  @Field(() => Boolean)
  success: boolean

  @Field(() => String, { nullable: true })
  message?: string
}
