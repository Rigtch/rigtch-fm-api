import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export abstract class RefreshResponse {
  @Field()
  accessToken: string
  @Field()
  refreshToken: string
  @Field()
  expiresIn: number
}
