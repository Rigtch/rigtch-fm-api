import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AccessToken, MaxInt, SpotifyApi } from '@spotify/web-api-ts-sdk'

import { Environment } from '@config/environment'
import { AdaptersService } from '@common/adapters'

@Injectable()
export class SpotifyPlayerService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly configService: ConfigService,
    private readonly adaptersService: AdaptersService
  ) {}

  async getRecentlyPlayedTracks(
    token: AccessToken,
    limit: MaxInt<50> = 20,
    before?: number,
    after?: number
  ) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    return this.spotifySdk.player
      .getRecentlyPlayedTracks(
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
      .then(data => this.adaptersService.tracks.adapt(data))
  }

  async getPlaybackState(token: AccessToken) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    return this.spotifySdk.player
      .getPlaybackState()
      .then(data => this.adaptersService.playbackState.adapt(data))
  }

  async pausePlayback(token: AccessToken) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    const { devices } = await this.spotifySdk.player.getAvailableDevices()

    const deviceId = devices.find(({ is_active }) => is_active)?.id

    if (!deviceId) return false

    await this.spotifySdk.player.pausePlayback(deviceId)

    return true
  }

  async resumePlayback(token: AccessToken) {
    this.spotifySdk = SpotifyApi.withAccessToken(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      token
    )

    const { devices } = await this.spotifySdk.player.getAvailableDevices()

    const deviceId = devices.find(({ is_active }) => is_active)?.id

    if (!deviceId) return false

    await this.spotifySdk.player.startResumePlayback(deviceId)

    return true
  }
}
