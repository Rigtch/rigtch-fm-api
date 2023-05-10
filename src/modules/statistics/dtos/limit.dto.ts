import { ArgsType, Field } from '@nestjs/graphql'
import { IsOptional, Max } from 'class-validator'

@ArgsType()
export abstract class LimitArguments {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @Max(50)
  limit?: number
}
