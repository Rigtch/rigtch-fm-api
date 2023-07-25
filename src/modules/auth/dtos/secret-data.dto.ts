import { ApiProperty } from '@nestjs/swagger'

export class SecretData {
  @ApiProperty()
  accessToken: string

  @ApiProperty({ required: false })
  refreshToken?: string

  @ApiProperty({ type: Number })
  expiresIn: number
}
