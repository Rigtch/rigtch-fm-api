import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AccessToken, MaxInt, SpotifyApi } from '@spotify/web-api-ts-sdk'

import { analysisFactory } from './utils'
import { TimeRange } from './enums'

import { Environment } from '@config/environment'
import {
  adaptAudioFeatures,
  adaptGenres,
  adaptPaginatedArtists,
  adaptPaginatedTracks,
  adaptProfile,
} from '@common/adapters'

@Injectable()
export class SpotifyUsersService {
  private spotifySdk: SpotifyApi | undefined

  constructor(private readonly configService: ConfigService) {}

  async profile(token: AccessToken) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    return this.spotifySdk.currentUser.profile().then(adaptProfile)
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

    return this.spotifySdk.currentUser
      .topItems('artists', timeRange, limit, offset)
      .then(adaptPaginatedArtists)
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

    return this.spotifySdk.currentUser
      .topItems('tracks', timeRange, limit, offset)
      .then(adaptPaginatedTracks)
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

    return this.spotifySdk.currentUser
      .topItems('artists', timeRange, 50, offset)
      .then(({ items }) => adaptGenres(items, limit))
  }

  async getAnalysis(token: AccessToken, timeRange = TimeRange.LONG_TERM) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    const { items } = await this.spotifySdk.currentUser
      .topItems('tracks', timeRange, 50, 0)
      .then(adaptPaginatedTracks)

    const tracksIds = items.map(({ id }) => id)

    return this.spotifySdk.tracks
      .audioFeatures(tracksIds)
      .then(audioFeatures => audioFeatures.map(adaptAudioFeatures))
      .then(analysisFactory)
  }
}
