import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export abstract class RefreshToken {
  @ApiProperty()
  @IsString()
  refreshToken: string
}
