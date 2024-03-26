import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { backOff } from 'exponential-backoff'

import { CHUNK_SIZE } from '../constants'

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

    const data = await backOff(() => this.spotifySdk!.artists.get(id))

    return adapt ? this.adaptersService.artists.adapt(data) : data
  }

  public getArtists(ids: string[], adapt: true): Promise<Artist[]>
  public getArtists(ids: string[], adapt: false): Promise<SdkArtist[]>

  async getArtists(ids: string[], adapt = true) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const chunks: string[][] = []

    if (ids.length > CHUNK_SIZE) {
      for (let index = 0; index < ids.length; index += CHUNK_SIZE) {
        chunks.push(ids.slice(index, index + CHUNK_SIZE))
      }
    }

    const data = await Promise.all(
      chunks.map(async chunk => {
        const data = await backOff(() => this.spotifySdk!.artists.get(chunk))

        return adapt ? this.adaptersService.artists.adapt(data) : data
      })
    )

    return data.flat()
  }
}
