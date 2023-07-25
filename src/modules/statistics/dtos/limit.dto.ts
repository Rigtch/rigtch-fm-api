import { IsOptional, Max } from 'class-validator'

export abstract class LimitArguments {
  @IsOptional()
  @Max(50)
  limit?: number
}
