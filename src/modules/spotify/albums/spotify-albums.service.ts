import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import { Environment } from '@config/environment'
import { AdaptersService } from '@common/adapters'

@Injectable()
export class SpotifyAlbumsService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly configService: ConfigService,
    private readonly adaptersService: AdaptersService
  ) {}

  async getAlbum(id: string) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    return this.spotifySdk.albums
      .get(id)
      .then(data => this.adaptersService.albums.adapt(data))
  }
}
