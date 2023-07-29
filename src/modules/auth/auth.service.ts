import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Profile } from 'passport-spotify'
import { Observable, map, catchError } from 'rxjs'

import { SecretData } from './dtos'
import { TokenOptions } from './types'

import { Environment } from '~/config'
import {
  SpotifyToken,
  FormattedProfile,
  SpotifyProfile,
} from '@common/types/spotify'
import { applyAuthorizationHeader, catchSpotifyError } from '~/utils'
import { adaptProfile, adaptSecretData } from '@common/adapters'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  login({ id, username }: Profile) {
    const payload = {
      name: username,
      sub: id,
    }

    return this.jwtService.sign(payload)
  }

  token({ refreshToken, code }: TokenOptions): Observable<SecretData> {
    const url = `${this.configService.get(
      Environment.SPOTIFY_ACCOUNTS_URL
    )}/api/token`
    const cliendId = this.configService.get(Environment.SPOTIFY_CLIENT_ID)
    const clientSecret = this.configService.get(
      Environment.SPOTIFY_CLIENT_SECRET
    )
    const bufferedCredentials = Buffer.from(
      `${cliendId}:${clientSecret}`
    ).toString('base64')
    const parameters = new URLSearchParams()

    if (refreshToken) {
      parameters.append('refresh_token', refreshToken)
      parameters.append('grant_type', 'refresh_token')
    }
    if (code) {
      parameters.append('code', code)
      parameters.append('grant_type', 'authorization_code')
      parameters.append(
        'redirect_uri',
        this.configService.get(Environment.SPOTIFY_CALLBACK_URL)
      )
    }

    return this.httpService
      .post<SpotifyToken>(url, parameters, {
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
  }

  profile(accessToken: string): Observable<FormattedProfile> {
    return this.httpService
      .get<SpotifyProfile>('/me', applyAuthorizationHeader(accessToken))
      .pipe(
        map(response => response.data),
        map(adaptProfile),
        catchError(catchSpotifyError)
      )
  }
}
