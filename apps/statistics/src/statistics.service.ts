import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { catchError, map, Observable } from 'rxjs'

import {
  FormattedTrack,
  FormattedArtist,
  SpotifyArtist,
  SpotifyResponse,
  SpotifyTrack,
  SpotifyService,
} from '@lib/common'
import { catchSpotifyError } from '@lib/utils'

@Injectable()
export class StatisticsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly spotifyService: SpotifyService
  ) {}

  getHello(): string {
    return 'Hello World!'
  }

  lastTracks(accessToken: string, limit = 20): Observable<FormattedTrack[]> {
    return this.httpService
      .get<SpotifyResponse<{ track: SpotifyTrack }>>(
        `/me/player/recently-played?limit=${limit}&after=604800000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .pipe(
        map(response => response.data.items),
        map(items => items.map(item => item.track)),
        map(this.spotifyService.formatTracks),
        catchError(catchSpotifyError)
      )
  }

  topArtists(accessToken: string, limit = 10): Observable<FormattedArtist[]> {
    return this.httpService
      .get<SpotifyResponse<SpotifyArtist>>(`/me/top/artists?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map(response => response.data.items),
        map(this.spotifyService.formatArtists),
        catchError(catchSpotifyError)
      )
  }

  topTracks(accessToken: string, limit = 10): Observable<FormattedTrack[]> {
    return this.httpService
      .get<SpotifyResponse<SpotifyTrack>>(`/me/top/tracks?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map(response => response.data.items),
        map(this.spotifyService.formatTracks),
        catchError(catchSpotifyError)
      )
  }
}
