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

  public get(id: string, adapt: false): Promise<SdkTrack>
  public get(id: string, adapt: true): Promise<Track>
  public get(ids: string[], adapt: false): Promise<SdkTrack[]>
  public get(ids: string[], adapt: true): Promise<Track[]>

  async get(idOrIds: string | string[], adapt = false) {
    if (!Array.isArray(idOrIds)) {
      const track = await this.getOne(idOrIds)

      return adapt ? this.adaptersService.tracks.adapt(track) : track
    }

    const tracks = await this.getMany(idOrIds)

    return adapt ? this.adaptersService.tracks.adapt(tracks) : tracks
  }

  private async getOne(id: string) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    return backOff(() => this.spotifySdk!.tracks.get(id))
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

    const tracks = await Promise.all(
      chunks.map(chunk => backOff(() => this.spotifySdk!.tracks.get(chunk)))
    )

    return tracks.flat()
  }
}
