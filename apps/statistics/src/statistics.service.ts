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
  Genres,
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
      .get<SpotifyResponse<{ track: SpotifyTrack; played_at: string }>>(
        `/me/player/recently-played?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .pipe(
        map(response => response.data.items),
        map(items =>
          items.map(({ track, played_at }) => ({
            ...track,
            played_at,
          }))
        ),
        map(this.spotifyService.formatTracks),
        catchError(catchSpotifyError)
      )
  }

  topGenres(accessToken: string, limit = 10): Observable<Genres> {
    return this.httpService
      .get<SpotifyResponse<SpotifyArtist>>(
        `/me/top/artists?limit=${50}&time_range=long_term`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .pipe(
        map(response => response.data.items),
        map(items => this.spotifyService.formatGenres(items, limit)),
        catchError(catchSpotifyError)
      )
  }

  topArtists(accessToken: string, limit = 10): Observable<FormattedArtist[]> {
    return this.httpService
      .get<SpotifyResponse<SpotifyArtist>>(
        `/me/top/artists?limit=${limit}&time_range=long_term`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .pipe(
        map(response => response.data.items),
        map(this.spotifyService.formatArtists),
        catchError(catchSpotifyError)
      )
  }

  topTracks(accessToken: string, limit = 10): Observable<FormattedTrack[]> {
    return this.httpService
      .get<SpotifyResponse<SpotifyTrack>>(
        `/me/top/tracks?limit=${limit}&time_range=long_term`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .pipe(
        map(response => response.data.items),
        map(this.spotifyService.formatTracks),
        catchError(catchSpotifyError)
      )
  }

  artist(accessToken: string, id: string) {
    return this.httpService
      .get<SpotifyArtist>(`/artists/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map(response => response.data),
        map(artist => this.spotifyService.formatArtists([artist])[0]),
        catchError(catchSpotifyError)
      )
  }
}
