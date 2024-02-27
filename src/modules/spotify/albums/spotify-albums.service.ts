import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import { Environment } from '@config/environment'
import { AdaptersService } from '@common/adapters'
import { Album, SdkAlbum } from '@common/types/spotify'

@Injectable()
export class SpotifyAlbumsService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly configService: ConfigService,
    private readonly adaptersService: AdaptersService
  ) {}

  public getAlbum(id: string, adapt: false): Promise<SdkAlbum>
  public getAlbum(id: string, adapt: true): Promise<Album>

  async getAlbum(id: string, adapt = false) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const data = await this.spotifySdk.albums.get(id)

    return adapt ? this.adaptersService.albums.adapt(data) : data
  }

  public getAlbums(ids: string[], adapt: false): Promise<SdkAlbum[]>
  public getAlbums(ids: string[], adapt: true): Promise<Album[]>

  async getAlbums(ids: string[], adapt = false) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const data = await this.spotifySdk.albums.get(ids)

    return adapt ? this.adaptersService.albums.adapt(data) : data
  }
}
