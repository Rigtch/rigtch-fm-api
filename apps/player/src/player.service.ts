import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { catchError, map, Observable } from 'rxjs'

import { FormattedDevice, SpotifyDevice, SpotifyService } from '@lib/common'
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
}
