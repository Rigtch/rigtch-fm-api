import { IsString } from 'class-validator'

export abstract class IdArguments {
  @IsString()
  id: string
}
