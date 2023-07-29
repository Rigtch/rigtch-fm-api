import { SpotifyToken } from '../types/spotify'

import { SecretData } from '~/modules/auth'

export const adaptSecretData = ({
  access_token,
  refresh_token,
  expires_in,
}: SpotifyToken): SecretData => ({
  accessToken: access_token,
  refreshToken: refresh_token,
  expiresIn: expires_in,
})
