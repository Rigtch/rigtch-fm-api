import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { map, catchError, firstValueFrom } from 'rxjs'
import { AccessToken } from '@spotify/web-api-ts-sdk'
import { backOff } from 'exponential-backoff'

import { TokenOptions } from './types'

import { Environment } from '@config/environment'
import { catchSpotifyError } from '@common/utils'
import { Profile, SdkProfile } from '@common/types/spotify'
import { AdaptersService } from '@common/adapters'

@Injectable()
export class SpotifyAuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly adaptersService: AdaptersService
  ) {}

  token({ refreshToken }: TokenOptions) {
    const url = `${this.configService.get(
      Environment.SPOTIFY_ACCOUNTS_URL
    )}/api/token`
    const clientId = this.configService.get(Environment.SPOTIFY_CLIENT_ID)
    const clientSecret = this.configService.get(
      Environment.SPOTIFY_CLIENT_SECRET
    )
    const bufferedCredentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString('base64')

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })

    return backOff(
      () =>
        firstValueFrom(
          this.httpService
            .post<AccessToken>(url, params, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${bufferedCredentials}`,
              },
            })
            .pipe(
              map(response => response.data),
              catchError(catchSpotifyError)
            )
        ),
      { numOfAttempts: 3 }
    )
  }

  getMeProfile(accessToken: string): Promise<Profile> {
    return backOff(() =>
      firstValueFrom(
        this.httpService
          .get<SdkProfile>('/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .pipe(
            map(response => this.adaptersService.profile.adapt(response.data)),
            catchError(catchSpotifyError)
          )
      )
    )
  }
}
