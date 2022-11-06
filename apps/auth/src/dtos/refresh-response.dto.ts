import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export abstract class RefreshResponse {
  @Field()
  accessToken: string

  @Field({ nullable: true })
  refreshToken?: string

  @Field()
  expiresIn: number
}
