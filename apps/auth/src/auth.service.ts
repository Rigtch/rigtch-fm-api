import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Profile } from 'passport-spotify'
import { catchError, map, Observable } from 'rxjs'

import { Environment } from './config'
import { RefreshResponse, SpotifyTokenResponse } from './dtos'

import { catchSpotifyError } from '@lib/utils'

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

  refresh(refreshToken: string): Observable<RefreshResponse> {
    const cliendId = this.configService.get(Environment.SPOTIFY_CLIENT_ID)
    const clientSecret = this.configService.get(
      Environment.SPOTIFY_CLIENT_SECRET
    )
    const bufferedCredentials = Buffer.from(
      `${cliendId}:${clientSecret}`
    ).toString('base64')
    const parameters = new URLSearchParams()

    parameters.append('grant_type', 'refresh_token')
    parameters.append('refresh_token', refreshToken)

    return this.httpService
      .post<SpotifyTokenResponse>('/api/token', parameters, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${bufferedCredentials}`,
          json: true,
        },
      })
      .pipe(
        map(response => response.data),
        map(({ access_token, refresh_token, expires_in }) => ({
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresIn: expires_in,
        })),
        catchError(catchSpotifyError)
      )
  }

  getHello() {
    return 'Hello World!'
  }
}
