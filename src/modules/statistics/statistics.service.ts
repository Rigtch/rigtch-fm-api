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
  SpotifyResponseWithOffset,
  SpotifyResponseWithCursors,
} from '@common/types/spotify'
import { applyAuthorizationHeader, catchSpotifyError } from '@common/utils'
import {
  adaptArtist,
  adaptAudioFeatures,
  adaptGenres,
  adaptLastTracks,
  adaptPaginatedArtists,
  adaptPaginatedTracks,
} from '@common/adapters'

@Injectable()
export class StatisticsService {
  constructor(private readonly httpService: HttpService) {}

  lastTracks(
    accessToken: string,
    limit = 20,
    before?: string,
    after?: string
  ): Observable<SpotifyResponseWithCursors<FormattedTrack>> {
    const urlSearchParameters = new URLSearchParams({
      limit: limit + '',
    })

    if (before) urlSearchParameters.append('before', before)
    if (after) urlSearchParameters.append('after', after)

    return this.httpService
      .get<
        SpotifyResponseWithCursors<{ track: SpotifyTrack; played_at: string }>
      >(
        `/me/player/recently-played?${urlSearchParameters.toString()}`,
        applyAuthorizationHeader(accessToken)
      )
      .pipe(
        map(response => response.data),
        map(({ items, ...data }) => ({
          ...data,
          items: items.map(({ track, played_at }) => ({
            ...track,
            played_at,
          })),
        })),
        map(adaptLastTracks),
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
  ): Observable<SpotifyResponseWithOffset<FormattedArtist>> {
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
  ): Observable<SpotifyResponseWithOffset<FormattedTrack>> {
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
