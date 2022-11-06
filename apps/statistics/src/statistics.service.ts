import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { catchError, map, Observable } from 'rxjs'

import { formatArtists, formatTracks, catchSpotifyError } from './utils'
import {
  FormattedTrack,
  FormattedArtist,
  SpotifyArtist,
  SpotifyResponse,
  SpotifyTrack,
} from './types'

@Injectable()
export class StatisticsService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!'
  }

  getlastTracks(accessToken: string): Observable<FormattedTrack[]> {
    return this.httpService
      .get<SpotifyResponse<{ track: SpotifyTrack }>>(
        '/me/player/recently-played?limit=50&after=604800000',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .pipe(
        map(response => response.data.items),
        map(items => items.map(item => item.track)),
        map(formatTracks),
        catchError(catchSpotifyError)
      )
  }

  getTopArtists(accessToken: string): Observable<FormattedArtist[]> {
    return this.httpService
      .get<SpotifyResponse<SpotifyArtist>>('/me/top/artists?limit=10', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map(response => response.data.items),
        map(formatArtists),
        catchError(catchSpotifyError)
      )
  }

  getTopTracks(accessToken: string): Observable<FormattedTrack[]> {
    return this.httpService
      .get<SpotifyResponse<SpotifyTrack>>('/me/top/tracks?limit=10', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map(response => response.data.items),
        map(formatTracks),
        catchError(catchSpotifyError)
      )
  }
}
