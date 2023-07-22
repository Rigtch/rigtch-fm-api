import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Observable, map, catchError, mergeMap } from 'rxjs'

import { analysisFactory } from './utils'

import { AdapterService } from '@modules/adapter'
import { Genres, Analysis } from '@common/dtos'
import {
  FormattedTrack,
  SpotifyResponse,
  SpotifyTrack,
  SpotifyArtist,
  FormattedArtist,
  SpotifyAudioFeatures,
} from '@common/types/spotify'
import { applyAuthorizationHeader, catchSpotifyError } from '~/utils'

@Injectable()
export class StatisticsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly adapterService: AdapterService
  ) {}

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
        map(this.adapterService.adaptArtist),
        catchError(catchSpotifyError)
      )
  }

  analysis(accessToken: string): Observable<Analysis> {
    return this.topTracks(accessToken, 50).pipe(
      mergeMap(tracks => {
        const tracksIds = tracks.map(({ id }) => id).join(',')

        return this.httpService
          .get<{ audio_features: SpotifyAudioFeatures[] }>(
            `/audio-features?ids=${tracksIds}`,
            applyAuthorizationHeader(accessToken)
          )
          .pipe(
            map(response => response.data.audio_features),
            map(audioFeatures =>
              audioFeatures.map(audioFeature =>
                this.adapterService.adaptAudioFeatures(audioFeature)
              )
            ),
            map(analysisFactory),
            catchError(catchSpotifyError)
          )
      })
    )
  }
}
