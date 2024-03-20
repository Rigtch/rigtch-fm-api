import { IsString } from 'class-validator'

export abstract class IdArguments {
  @IsString()
  readonly id: string
}
