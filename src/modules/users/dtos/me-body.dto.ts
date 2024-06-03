import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export abstract class MeBody {
  @ApiProperty({
    description:
      'The refresh token returned from the authorization token request.',
    example: 'refresh_token',
  })
  @IsString()
  readonly refreshToken: string
}
