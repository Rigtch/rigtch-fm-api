import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export abstract class TokenResponse {
  @Field()
  accessToken: string

  @Field({ nullable: true })
  refreshToken?: string

  @Field()
  expiresIn: number
}
