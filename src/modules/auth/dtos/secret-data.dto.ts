import { ApiProperty } from '@nestjs/swagger'

export class SecretData {
  @ApiProperty()
  readonly accessToken: string

  @ApiProperty({ required: false })
  readonly refreshToken?: string

  @ApiProperty({ type: Number })
  readonly expiresIn: number
}
