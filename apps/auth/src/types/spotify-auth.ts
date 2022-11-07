import { Profile } from 'passport-spotify'
import { Request } from 'express'

import { AuthInfo } from '../dtos/auth-info.dto'

export interface SpotifyAuth {
  user: Profile
  authInfo: AuthInfo
}

export type SpotifyAuthRequest = SpotifyAuth & Request
