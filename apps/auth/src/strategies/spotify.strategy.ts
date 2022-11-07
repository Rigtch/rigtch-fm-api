import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-spotify'

import { Environment } from '@app/auth/config'

const { SPOTIFY_CALLBACK_URL, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } =
  Environment

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  constructor(private readonly configService: ConfigService) {
    super(
      {
        clientID: configService.get(SPOTIFY_CLIENT_ID),
        clientSecret: configService.get(SPOTIFY_CLIENT_SECRET),
        callbackURL: configService.get(SPOTIFY_CALLBACK_URL),
        scope: [
          'user-follow-read',
          'user-read-recently-played',
          'user-read-playback-position',
          'user-top-read',
          'playlist-read-collaborative',
          'playlist-modify-public',
          'playlist-read-private',
          'playlist-modify-private',
          'app-remote-control',
          'streaming',
          'user-read-email',
          'user-read-private',
          'user-library-modify',
          'user-library-read',
        ],
      },
      (
        accessToken: string,
        refreshToken: string,
        expires_in: number,
        profile: Profile,
        done: VerifyCallback
      ): void => {
        return done(undefined, profile, {
          accessToken,
          refreshToken,
          expires_in,
        })
      }
    )
  }
}
