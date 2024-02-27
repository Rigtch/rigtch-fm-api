import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Injectable } from '@nestjs/common'

import { AdaptersService } from '@common/adapters'
import { Environment } from '@config/environment'
import { SdkTrack, Track } from '@common/types/spotify'

@Injectable()
export class SpotifyTracksService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly configService: ConfigService,
    private readonly adaptersService: AdaptersService
  ) {}

  public getTrack(id: string, adapt: false): Promise<SdkTrack>
  public getTrack(id: string, adapt: true): Promise<Track>

  async getTrack(id: string, adapt = true) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const data = await this.spotifySdk.tracks.get(id)

    return adapt ? this.adaptersService.tracks.adapt(data) : data
  }

  public getTracks(ids: string[], adapt: false): Promise<SdkTrack[]>
  public getTracks(ids: string[], adapt: true): Promise<Track[]>

  async getTracks(ids: string[], adapt = true) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const data = await this.spotifySdk.tracks.get(ids)

    return adapt ? this.adaptersService.tracks.adapt(data) : data
  }
}
