import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { catchError, map, Observable, tap, timer } from 'rxjs'

import {
  FormattedDevice,
  SpotifyDevice,
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
        map(this.spotifyService.formatDevices),
        catchError(catchSpotifyError)
      )
  }

  pausePlayer(
    accessToken: string,
    afterTime = 0,
    _deviceId?: string
  ): Observable<Observable<Success>> {
    let deviceId = _deviceId

    if (!deviceId) {
      this.avaibleDevices(accessToken).pipe(
        tap(avaibleDevices => {
          console.log(avaibleDevices)

          if (avaibleDevices.length <= 0)
            throw new BadRequestException('No device is avaible')

          const activeDevice = avaibleDevices.find(({ isActive }) => !!isActive)

          if (!activeDevice)
            throw new BadRequestException('No device is currently playing')

          deviceId = activeDevice.id
        })
      )
    }

    return timer(afterTime).pipe(
      map(() => {
        return this.httpService
          .put(
            '/me/player/pause',
            {
              device_id: deviceId,
            },
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
                throw new BadRequestException('No device is currently playing')

              return catchSpotifyError(error)
            })
          )
      })
    )
  }
}
