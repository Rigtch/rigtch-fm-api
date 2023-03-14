import { HttpService } from '@nestjs/axios'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { catchError, exhaustMap, map, Observable, tap, timer } from 'rxjs'

import { PlayerMessage } from './messages/index'

import {
  FormattedDevice,
  FormattedPlaybackState,
  SpotifyDevice,
  SpotifyPlaybackState,
  SpotifyService,
  Success,
} from '@lib/common'
import { catchSpotifyError } from '@lib/utils'

@Injectable()
export class PlayerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly spotifyService: SpotifyService
  ) {}

  avaibleDevices(accessToken: string): Observable<FormattedDevice[]> {
    return this.httpService
      .get<{ devices: SpotifyDevice[] }>('/me/player/devices', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map(response => response.data.devices),
        catchError(catchSpotifyError),
        tap(devices => {
          if (devices.length <= 0)
            throw new ForbiddenException(PlayerMessage.NO_AVAIBLE_DEVICES)
        }),
        map(this.spotifyService.formatDevices)
      )
  }

  currentPlaybackState(
    accessToken: string
  ): Observable<FormattedPlaybackState> {
    return this.httpService
      .get<SpotifyPlaybackState>('/me/player', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map(response => response.data),
        catchError(catchSpotifyError),
        tap(playbackState => {
          if (!playbackState.device)
            throw new ForbiddenException(PlayerMessage.NO_PLAYING_DEVICE)
        }),
        map(this.spotifyService.formatPlaybackState)
      )
  }

  pausePlayer(
    accessToken: string,
    afterTime = 0,
    deviceId?: string
  ): Observable<Success> {
    const deviceIdQuery = `?device_id=${deviceId}`

    return timer(afterTime).pipe(
      exhaustMap(() => {
        return this.httpService
          .put(
            `/me/player/pause${deviceId ? deviceIdQuery : ''}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .pipe(
            map(() => ({
              success: true,
            })),
            catchError(error => {
              if (error.response.data.error.status === 403)
                throw new ForbiddenException(PlayerMessage.NO_PLAYING_DEVICE)

              return catchSpotifyError(error)
            })
          )
      })
    )
  }

  resumePlayer(accessToken: string, deviceId?: string): Observable<Success> {
    const deviceIdQuery = `?device_id=${deviceId}`

    return this.httpService
      .put(
        `/me/player/play${deviceId ? deviceIdQuery : ''}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .pipe(
        map(() => ({
          success: true,
        })),
        catchError(error => {
          if (error.response.data.error.status === 403)
            throw new ForbiddenException(PlayerMessage.DEVICE_ALREADY_PLAYING)

          return catchSpotifyError(error)
        })
      )
  }
}
