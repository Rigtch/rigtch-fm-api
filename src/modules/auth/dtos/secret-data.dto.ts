import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType()
export class SecretData {
  @Field(() => String)
  @ApiProperty()
  accessToken: string

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  refreshToken?: string

  @Field(() => Number)
  @ApiProperty({ type: Number })
  expiresIn: number
}
