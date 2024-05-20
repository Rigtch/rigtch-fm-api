import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { backOff } from 'exponential-backoff'

import { CHUNK_SIZE } from '../constants'

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

    const data = await backOff(() => this.spotifySdk!.albums.get(id))

    return adapt ? this.adaptersService.albums.adapt(data) : data
  }

  public getAlbums(ids: string[], adapt: false): Promise<SdkAlbum[]>
  public getAlbums(ids: string[], adapt: true): Promise<Album[]>

  async getAlbums(ids: string[], adapt = false) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const chunks: string[][] = []

    if (ids.length > CHUNK_SIZE)
      for (let index = 0; index < ids.length; index += CHUNK_SIZE) {
        chunks.push(ids.slice(index, index + CHUNK_SIZE))
      }
    else chunks.push(ids)

    const data = await Promise.all(
      chunks.map(async chunk => {
        const data = await backOff(() => this.spotifySdk!.albums.get(chunk))

        return adapt ? this.adaptersService.albums.adapt(data) : data
      })
    )

    return data.flat()
  }
}
