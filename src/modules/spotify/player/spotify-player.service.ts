import { Injectable } from '@nestjs/common'
import { AccessToken, MaxInt, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { backOff } from 'exponential-backoff'

import { QueryRange } from './types'

import { EnvService } from '@config/env'
import { AdaptersService } from '@common/adapters'
import {
  RecentlyPlayedTracksPage,
  SdkRecentlyPlayedTracksPage,
} from '@common/types/spotify'

@Injectable()
export class SpotifyPlayerService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly envService: EnvService,
    private readonly adaptersService: AdaptersService
  ) {}

  public getRecentlyPlayedTracks(
    token: AccessToken,
    limit: MaxInt<50>,
    queryRange?: QueryRange,
    adapt?: false
  ): Promise<SdkRecentlyPlayedTracksPage>
  public getRecentlyPlayedTracks(
    token: AccessToken,
    limit: MaxInt<50>,
    queryRange?: QueryRange,
    adapt?: true
  ): Promise<RecentlyPlayedTracksPage>

  async getRecentlyPlayedTracks(
    token: AccessToken,
    limit: MaxInt<50> = 20,
    { before, after }: QueryRange = {},
    adapt = true
  ) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.envService.get('SPOTIFY_CLIENT_ID'),
      token
    )

    const data = await backOff(() =>
      this.spotifySdk!.player.getRecentlyPlayedTracks(
        limit,
        before
          ? {
              timestamp: +before,
              type: 'before',
            }
          : after
            ? {
                timestamp: +after,
                type: 'after',
              }
            : undefined
      )
    )

    return adapt ? this.adaptersService.tracks.adapt(data) : data
  }

  async getPlaybackState(token: AccessToken) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.envService.get('SPOTIFY_CLIENT_ID'),
      token
    )

    return backOff(() =>
      this.spotifySdk!.player.getPlaybackState().then(data =>
        this.adaptersService.playbackState.adapt(data)
      )
    )
  }

  async pausePlayback(token: AccessToken) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.envService.get('SPOTIFY_CLIENT_ID'),
      token
    )

    const { devices } = await backOff(() =>
      this.spotifySdk!.player.getAvailableDevices()
    )

    const deviceId = devices.find(({ is_active }) => is_active)?.id

    if (!deviceId) return false

    await backOff(() => this.spotifySdk!.player.pausePlayback(deviceId))

    return true
  }

  async resumePlayback(token: AccessToken) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.envService.get('SPOTIFY_CLIENT_ID'),
      token
    )

    const { devices } = await backOff(() =>
      this.spotifySdk!.player.getAvailableDevices()
    )

    const deviceId = devices.find(({ is_active }) => is_active)?.id

    if (!deviceId) return false

    await backOff(() => this.spotifySdk!.player.startResumePlayback(deviceId))

    return true
  }
}
