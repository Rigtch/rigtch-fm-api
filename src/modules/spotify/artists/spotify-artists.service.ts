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

  public get(id: string, adapt: false): Promise<SdkArtist>
  public get(id: string, adapt: true): Promise<Artist>
  public get(ids: string[], adapt: false): Promise<SdkArtist[]>
  public get(ids: string[], adapt: true): Promise<Artist[]>

  async get(idOrIds: string | string[], adapt = false) {
    if (!Array.isArray(idOrIds)) {
      const artist = await this.getOne(idOrIds)

      return adapt ? this.adaptersService.artists.adapt(artist) : artist
    }

    const artists = await this.getMany(idOrIds)

    return adapt ? this.adaptersService.artists.adapt(artists) : artists
  }

  private async getOne(id: string) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    return backOff(() => this.spotifySdk!.artists.get(id))
  }

  private async getMany(ids: string[]) {
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

    const artists = await Promise.all(
      chunks.map(chunk => backOff(() => this.spotifySdk!.artists.get(chunk)))
    )

    return artists.flat()
  }
}
