import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export abstract class RefreshToken {
  @ApiProperty({
    example: 'refresh_token',
    description: 'The refresh token returned from spotify callback.',
  })
  @IsString()
  readonly refreshToken: string
}
