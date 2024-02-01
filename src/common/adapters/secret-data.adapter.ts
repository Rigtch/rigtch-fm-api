import { Injectable } from '@nestjs/common'
import { AccessToken } from '@spotify/web-api-ts-sdk'

import { SecretData } from '@modules/auth/dtos'

@Injectable()
export class SecretDataAdapter {
  adapt = ({
    access_token,
    refresh_token,
    expires_in,
  }: AccessToken): SecretData => ({
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresIn: expires_in,
  })
}
