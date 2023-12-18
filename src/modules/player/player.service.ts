import { HttpService } from '@nestjs/axios'
import { Injectable, ForbiddenException } from '@nestjs/common'
import { Observable, map, catchError, tap, timer, exhaustMap } from 'rxjs'

import { PlayerMessage } from './messages'

import {
  Device,
  SpotifyDevice,
  PlaybackState,
  SpotifyPlaybackState,
} from '@common/types/spotify'
import {
  SpotifyResponseError,
  applyAuthorizationHeader,
  catchSpotifyError,
} from '@common/utils'
import { Success } from '@common/dtos'
import { adaptDevices, adaptPlaybackState } from '@common/adapters'

@Injectable()
export class PlayerService {
  constructor(private readonly httpService: HttpService) {}

  availableDevices(accessToken: string): Observable<Device[]> {
    return this.httpService
      .get<{ devices: SpotifyDevice[] }>(
        '/me/player/devices',
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data.devices),
        catchError(catchSpotifyError),
        tap(devices => {
          if (devices.length <= 0)
            throw new ForbiddenException(PlayerMessage.NO_AVAIBLE_DEVICES)
        }),
        map(adaptDevices)
      )
  }

  currentPlaybackState(accessToken: string): Observable<PlaybackState> {
    return this.httpService
      .get<SpotifyPlaybackState>(
        '/me/player',
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data),
        tap(playbackState => {
          if (!playbackState.device.is_active)
            throw new ForbiddenException(PlayerMessage.NO_PLAYING_DEVICE)
        }),
        map(adaptPlaybackState),
        catchError(catchSpotifyError)
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
            applyAuthorizationHeader(accessToken)
          )
          .pipe(
            map(() => ({
              success: true,
            })),
            catchError((response: SpotifyResponseError) => {
              if (
                !('error_description' in response.data) &&
                response.data.error.status === 403
              )
                throw new ForbiddenException(PlayerMessage.NO_PLAYING_DEVICE)

              return catchSpotifyError(response)
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
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(() => ({
          success: true,
        })),
        catchError((response: SpotifyResponseError) => {
          if (
            !('error_description' in response.data) &&
            response.data.error.status === 403
          )
            throw new ForbiddenException(PlayerMessage.DEVICE_ALREADY_PLAYING)

          return catchSpotifyError(response)
        })
      )
  }
}
