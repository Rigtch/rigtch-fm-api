import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Profile as PassportSpotifyProfile } from 'passport-spotify'
import { map, catchError, firstValueFrom } from 'rxjs'

import { SecretData } from './dtos'
import { TokenOptions } from './types'

import { Environment } from '@config/environment'
import { SpotifyToken, Profile, SpotifyProfile } from '@common/types/spotify'
import { applyAuthorizationHeader, catchSpotifyError } from '@common/utils'
import { adaptProfile, adaptSecretData } from '@common/adapters'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  login({ id, username }: PassportSpotifyProfile) {
    const payload = {
      name: username,
      sub: id,
    }

    return this.jwtService.sign(payload)
  }

  token({ refreshToken, code }: TokenOptions): Promise<SecretData> {
    const url = `${this.configService.get(
      Environment.SPOTIFY_ACCOUNTS_URL
    )}/api/token`
    const cliendId = this.configService.get<string>(
      Environment.SPOTIFY_CLIENT_ID
    )
    const clientSecret = this.configService.get<string>(
      Environment.SPOTIFY_CLIENT_SECRET
    )
    const callbackUrl = this.configService.get<string>(
      Environment.SPOTIFY_CALLBACK_URL
    )

    const bufferedCredentials = Buffer.from(
      `${cliendId}:${clientSecret}`
    ).toString('base64')
    const params = new URLSearchParams()

    if (refreshToken) {
      params.append('refresh_token', refreshToken)
      params.append('grant_type', 'refresh_token')
    }
    if (code) {
      params.append('code', code)
      params.append('grant_type', 'authorization_code')
      callbackUrl && params.append('redirect_uri', callbackUrl)
    }

    return firstValueFrom(
      this.httpService
        .post<SpotifyToken>(url, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${bufferedCredentials}`,
          },
        })
        .pipe(
          map(response => response.data),
          map(adaptSecretData),
          catchError(catchSpotifyError)
        )
    )
  }

  profile(accessToken: string): Promise<Profile> {
    return firstValueFrom(
      this.httpService
        .get<SpotifyProfile>('/me', applyAuthorizationHeader(accessToken))
        .pipe(
          map(response => response.data),
          map(adaptProfile),
          catchError(catchSpotifyError)
        )
    )
  }
}
