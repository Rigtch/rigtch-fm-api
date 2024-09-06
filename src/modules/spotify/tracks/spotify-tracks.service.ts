import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Injectable } from '@nestjs/common'
import { backOff } from 'exponential-backoff'

import { CHUNK_SIZE } from '../constants'
import { splitIntoChunks } from '../utils'

import { EnvService } from '@config/env'
import { AdaptersService } from '@common/adapters'
import { SdkTrack, Track } from '@common/types/spotify'

@Injectable()
export class SpotifyTracksService {
  private spotifySdk: SpotifyApi | undefined

  constructor(
    private readonly envService: EnvService,
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
      this.envService.get('SPOTIFY_CLIENT_ID'),
      this.envService.get('SPOTIFY_CLIENT_SECRET')
    )

    return backOff(() => this.spotifySdk!.tracks.get(id))
  }

  private async getMany(ids: string[]) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.envService.get('SPOTIFY_CLIENT_ID'),
      this.envService.get('SPOTIFY_CLIENT_SECRET')
    )

    const chunks = splitIntoChunks(ids, CHUNK_SIZE)

    const tracks = await Promise.all(
      chunks.map(chunk => backOff(() => this.spotifySdk!.tracks.get(chunk)))
    )

    return tracks.flat()
  }
}
