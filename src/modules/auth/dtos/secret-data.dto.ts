import { ApiProperty } from '@nestjs/swagger'

export class SecretData {
  @ApiProperty({
    example: 'access_token',
    description:
      'The access token is used to authenticate requests to the Spotify API.',
  })
  readonly accessToken: string

  @ApiProperty({
    required: false,
    example: 'refresh_token',
    description: 'The refresh token is used to obtain a new access token.',
  })
  readonly refreshToken?: string

  @ApiProperty({
    type: Number,
    example: 3600,
    description:
      'The time period (in seconds) for which the access token is valid.',
  })
  readonly expiresIn: number
}
