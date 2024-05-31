import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AccessToken, MaxInt, Page, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { backOff } from 'exponential-backoff'

import { analysisFactory } from './utils'
import { TimeRange } from './enums'
import { GetTopItemsParams } from './types'

import { Environment } from '@config/environment'
import { AdaptersService } from '@common/adapters'
import { Artist, SdkArtist, SdkTrack, Track } from '@common/types/spotify'

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

  public getTopArtists(
    token: AccessToken,
    params: GetTopItemsParams,
    adapt?: true
  ): Promise<Page<Artist>>

  public getTopArtists(
    token: AccessToken,
    params: GetTopItemsParams,
    adapt: false
  ): Promise<Page<SdkArtist>>

  async getTopArtists(
    token: AccessToken,
    {
      limit = 20,
      offset = 0,
      timeRange = TimeRange.LONG_TERM,
    }: GetTopItemsParams,
    adapt = true
  ) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    const topArtists = await backOff(() =>
      this.spotifySdk!.currentUser.topItems('artists', timeRange, limit, offset)
    )

    return adapt ? this.adaptersService.artists.adapt(topArtists) : topArtists
  }

  public getTopTracks(
    token: AccessToken,
    params: GetTopItemsParams,
    adapt?: true
  ): Promise<Page<Track>>

  public getTopTracks(
    token: AccessToken,
    params: GetTopItemsParams,
    adapt: false
  ): Promise<Page<SdkTrack>>

  async getTopTracks(
    token: AccessToken,
    {
      limit = 20,
      offset = 0,
      timeRange = TimeRange.LONG_TERM,
    }: GetTopItemsParams,
    adapt = true
  ) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    const topTracks = await backOff(() =>
      this.spotifySdk!.currentUser.topItems('tracks', timeRange, limit, offset)
    )

    return adapt ? this.adaptersService.tracks.adapt(topTracks) : topTracks
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
