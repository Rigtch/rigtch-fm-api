import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Observable, map, catchError } from 'rxjs'

import { AdapterService } from '../adapter'

import { Genres } from '~/common/dtos'
import {
  FormattedTrack,
  SpotifyResponse,
  SpotifyTrack,
  SpotifyArtist,
  FormattedArtist,
} from '~/common/types/spotify'
import { applyAuthorizationHeader, catchSpotifyError } from '~/utils'

@Injectable()
export class StatisticsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly adapterService: AdapterService
  ) {}

  getHello(): string {
    return 'Hello World!'
  }

  lastTracks(accessToken: string, limit = 20): Observable<FormattedTrack[]> {
    return this.httpService
      .get<SpotifyResponse<{ track: SpotifyTrack; played_at: string }>>(
        `/me/player/recently-played?limit=${limit}`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data.items),
        map(items =>
          items.map(({ track, played_at }) => ({
            ...track,
            played_at,
          }))
        ),
        map(this.adapterService.adaptTracks),
        catchError(catchSpotifyError)
      )
  }

  topGenres(accessToken: string, limit = 10): Observable<Genres> {
    return this.httpService
      .get<SpotifyResponse<SpotifyArtist>>(
        `/me/top/artists?limit=${50}&time_range=long_term`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data.items),
        map(items => this.adapterService.adaptGenres(items, limit)),
        catchError(catchSpotifyError)
      )
  }

  topArtists(accessToken: string, limit = 10): Observable<FormattedArtist[]> {
    return this.httpService
      .get<SpotifyResponse<SpotifyArtist>>(
        `/me/top/artists?limit=${limit}&time_range=long_term`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data.items),
        map(this.adapterService.adaptArtists),
        catchError(catchSpotifyError)
      )
  }

  topTracks(accessToken: string, limit = 10): Observable<FormattedTrack[]> {
    return this.httpService
      .get<SpotifyResponse<SpotifyTrack>>(
        `/me/top/tracks?limit=${limit}&time_range=long_term`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data.items),
        map(this.adapterService.adaptTracks),
        catchError(catchSpotifyError)
      )
  }

  artist(accessToken: string, id: string) {
    return this.httpService
      .get<SpotifyArtist>(
        `/artists/${id}`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data),
        map(artist => this.adapterService.adaptArtists([artist])[0]),
        catchError(catchSpotifyError)
      )
  }
}
