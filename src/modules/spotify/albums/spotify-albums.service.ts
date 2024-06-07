import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { backOff } from 'exponential-backoff'

import { CHUNK_SIZE } from '../constants'
import { splitIntoChunks } from '../utils'

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

  public get(id: string, adapt: false): Promise<SdkAlbum>
  public get(id: string, adapt: true): Promise<Album>
  public get(ids: string[], adapt: false): Promise<SdkAlbum[]>
  public get(ids: string[], adapt: true): Promise<Album[]>

  async get(idOrIds: string | string[], adapt = false) {
    if (!Array.isArray(idOrIds)) {
      const album = await this.getOne(idOrIds)

      return adapt ? this.adaptersService.albums.adapt(album) : album
    }

    const albums = await this.getMany(idOrIds)

    return adapt ? this.adaptersService.albums.adapt(albums) : albums
  }

  private async getOne(id: string) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    return this.getAlbumMissingTracks(
      await backOff(() => this.spotifySdk!.albums.get(id))
    )
  }

  private async getMany(ids: string[]) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const chunks = splitIntoChunks(ids, CHUNK_SIZE)

    const albums = await Promise.all(
      chunks.map(chunk =>
        backOff(async () => {
          const albums = await this.spotifySdk!.albums.get(chunk)

          return Promise.all(
            albums.map(async album => this.getAlbumMissingTracks(album))
          )
        })
      )
    )

    return albums.flat()
  }

  private async getAlbumMissingTracks(album: SdkAlbum) {
    if (album.tracks.next) {
      let offset = album.tracks.offset + album.tracks.items.length

      while (album.tracks.items.length < album.tracks.total) {
        const tracks = await backOff(() =>
          this.spotifySdk!.albums.tracks(album.id, undefined, undefined, offset)
        )

        album.tracks.items.push(...tracks.items)

        offset += tracks.items.length
      }
    }

    return album
  }
}
