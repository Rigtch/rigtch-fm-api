import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import { AdaptersService } from '@common/adapters'
import { Environment } from '@config/environment'

@Injectable()
export class SpotifyArtistsService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly configService: ConfigService,
    private readonly adaptersService: AdaptersService
  ) {}

  async getArtist(id: string) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    return this.spotifySdk.artists
      .get(id)
      .then(data => this.adaptersService.artists.adapt(data))
  }
}