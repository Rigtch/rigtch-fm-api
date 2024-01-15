import { AccessToken } from '@spotify/web-api-ts-sdk'

export interface SpotifyToken extends Omit<AccessToken, 'refresh_token'> {
  refresh_token?: string | null
}
