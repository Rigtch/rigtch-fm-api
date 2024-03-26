import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Injectable } from '@nestjs/common'
import { backOff } from 'exponential-backoff'

import { CHUNK_SIZE } from '../constants'

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

    const data = await backOff(() => this.spotifySdk!.tracks.get(id))

    return adapt ? this.adaptersService.tracks.adapt(data) : data
  }

  public getTracks(ids: string[], adapt: false): Promise<SdkTrack[]>
  public getTracks(ids: string[], adapt: true): Promise<Track[]>

  async getTracks(ids: string[], adapt = true) {
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
        const data = await backOff(() => this.spotifySdk!.tracks.get(chunk))

        return adapt ? this.adaptersService.tracks.adapt(data) : data
      })
    )

    return data.flat()
  }
}
