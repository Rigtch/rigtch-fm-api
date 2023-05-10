import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SecretData {
  @Field(() => String)
  accessToken: string

  @Field(() => String, { nullable: true })
  refreshToken?: string

  @Field(() => Number)
  expiresIn: number
}
