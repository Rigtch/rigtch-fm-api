import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AccessToken, MaxInt, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { backOff } from 'exponential-backoff'

import { analysisFactory } from './utils'
import { TimeRange } from './enums'

import { Environment } from '@config/environment'
import { AdaptersService } from '@common/adapters'

@Injectable()
export class SpotifyUsersService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly configService: ConfigService,
    private readonly adaptersService: AdaptersService
  ) {}

  async profile(token: AccessToken) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    return backOff(() =>
      this.spotifySdk!.currentUser.profile().then(data =>
        this.adaptersService.profile.adapt(data)
      )
    )
  }

  async getTopArtists(
    token: AccessToken,
    timeRange = TimeRange.LONG_TERM,
    limit: MaxInt<50> = 20,
    offset = 0
  ) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    return backOff(() =>
      this.spotifySdk!.currentUser.topItems(
        'artists',
        timeRange,
        limit,
        offset
      ).then(data => this.adaptersService.artists.adapt(data))
    )
  }

  async getTopTracks(
    token: AccessToken,
    timeRange = TimeRange.LONG_TERM,
    limit: MaxInt<50> = 20,
    offset = 0
  ) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    return backOff(() =>
      this.spotifySdk!.currentUser.topItems(
        'tracks',
        timeRange,
        limit,
        offset
      ).then(data => this.adaptersService.tracks.adapt(data))
    )
  }

  async getTopGenres(
    token: AccessToken,
    timeRange = TimeRange.LONG_TERM,
    limit: MaxInt<50> = 20,
    offset = 0
  ) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    return backOff(() =>
      this.spotifySdk!.currentUser.topItems(
        'artists',
        timeRange,
        50,
        offset
      ).then(({ items }) => this.adaptersService.genres.adapt(items, limit))
    )
  }

  async getAnalysis(token: AccessToken, timeRange = TimeRange.LONG_TERM) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    const { items } = await backOff(() =>
      this.spotifySdk!.currentUser.topItems('tracks', timeRange, 50, 0)
    )
    const tracksIds = items.map(({ id }) => id)

    return backOff(() =>
      this.spotifySdk!.tracks.audioFeatures(tracksIds)
        .then(data => this.adaptersService.audioFeatures.adapt(data))
        .then(analysisFactory)
    )
  }
}
