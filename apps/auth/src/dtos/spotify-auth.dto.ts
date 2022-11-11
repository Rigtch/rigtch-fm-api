import { Profile } from 'passport-spotify'

import { AuthInfo } from '.'

export abstract class SpotifyAuth {
  user: Profile
  authInfo: AuthInfo
}
