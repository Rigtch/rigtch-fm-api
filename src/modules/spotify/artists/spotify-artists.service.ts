import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import { AdaptersService } from '@common/adapters'
import { Environment } from '@config/environment'
import { Artist, SdkArtist } from '@common/types/spotify'

@Injectable()
export class SpotifyArtistsService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly configService: ConfigService,
    private readonly adaptersService: AdaptersService
  ) {}

  public getArtist(id: string, adapt: true): Promise<Artist>
  public getArtist(id: string, adapt: false): Promise<SdkArtist>

  async getArtist(id: string, adapt = true) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const data = await this.spotifySdk.artists.get(id)

    return adapt ? this.adaptersService.artists.adapt(data) : data
  }
}
