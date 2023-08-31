import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Observable, map, catchError, mergeMap } from 'rxjs'

import { analysisFactory } from './utils'
import { TimeRange } from './enums'

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
import {
  adaptArtist,
  adaptAudioFeatures,
  adaptGenres,
  adaptPaginatedArtists,
  adaptPaginatedTracks,
  adaptTracks,
} from '@common/adapters'

@Injectable()
export class StatisticsService {
  constructor(private readonly httpService: HttpService) {}

  lastTracks(accessToken: string, limit = 20): Observable<FormattedTrack[]> {
    const urlSearchParameters = new URLSearchParams({
      limit: limit + '',
    })

    console.log(urlSearchParameters.toString())

    return this.httpService
      .get<SpotifyResponse<{ track: SpotifyTrack; played_at: string }>>(
        `/me/player/recently-played?${urlSearchParameters.toString()}`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data),
        map(({ items }) =>
          items.map(({ track, played_at }) => ({
            ...track,
            played_at,
          }))
        ),
        map(adaptTracks),
        catchError(catchSpotifyError)
      )
  }

  topGenres(
    accessToken: string,
    limit = 10,
    timeRange = TimeRange.LONG_TERM,
    offset = 1
  ): Observable<Genres> {
    const urlSearchParameters = new URLSearchParams({
      limit: limit + '',
      offset: offset + '',
      time_range: timeRange,
    })

    return this.httpService
      .get<SpotifyResponse<SpotifyArtist>>(
        `/me/top/artists?${urlSearchParameters.toString()}`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data.items),
        map(items => adaptGenres(items, limit)),
        catchError(catchSpotifyError)
      )
  }

  topArtists(
    accessToken: string,
    limit = 10,
    timeRange = TimeRange.LONG_TERM,
    offset = 1
  ): Observable<SpotifyResponse<FormattedArtist>> {
    const urlSearchParameters = new URLSearchParams({
      limit: limit + '',
      offset: offset + '',
      time_range: timeRange,
    })

    return this.httpService
      .get<SpotifyResponse<SpotifyArtist>>(
        `/me/top/artists?${urlSearchParameters.toString()}`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data),
        map(adaptPaginatedArtists),
        catchError(catchSpotifyError)
      )
  }

  topTracks(
    accessToken: string,
    limit = 10,
    timeRange = TimeRange.LONG_TERM,
    offset = 1
  ): Observable<SpotifyResponse<FormattedTrack>> {
    const urlSearchParameters = new URLSearchParams({
      limit: limit + '',
      offset: offset + '',
      time_range: timeRange,
    })

    return this.httpService
      .get<SpotifyResponse<SpotifyTrack>>(
        `/me/top/tracks?${urlSearchParameters.toString()}`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data),
        map(adaptPaginatedTracks),
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
        map(adaptArtist),
        catchError(catchSpotifyError)
      )
  }

  analysis(accessToken: string): Observable<Analysis> {
    return this.topTracks(accessToken, 50).pipe(
      mergeMap(tracks => {
        const tracksIds = tracks.items.map(({ id }) => id).join(',')

        return this.httpService
          .get<{ audio_features: SpotifyAudioFeatures[] }>(
            `/audio-features?ids=${tracksIds}`,
            applyAuthorizationHeader(accessToken)
          )
          .pipe(
            map(response => response.data.audio_features),
            map(audioFeatures =>
              audioFeatures.map(audioFeature =>
                adaptAudioFeatures(audioFeature)
              )
            ),
            map(analysisFactory),
            catchError(catchSpotifyError)
          )
      })
    )
  }
}
