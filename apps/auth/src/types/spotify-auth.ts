import { Profile } from 'passport-spotify'
import { Request } from 'express'

import { AuthInfo } from '@app/auth/dtos'

export interface SpotifyAuth {
  user: Profile
  authInfo: AuthInfo
}

export type SpotifyAuthRequest = SpotifyAuth & Request
