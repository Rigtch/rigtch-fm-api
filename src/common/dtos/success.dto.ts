import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType()
export abstract class Success {
  @Field(() => Boolean)
  @ApiProperty({ type: Boolean })
  success: boolean

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  message?: string
}
