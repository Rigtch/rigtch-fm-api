import { ArgsType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ArgsType()
export abstract class IdArguments {
  @Field(() => String)
  @IsString()
  id: string
}
