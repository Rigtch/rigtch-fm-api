import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Market, Page, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { backOff } from 'exponential-backoff'

import { CHUNK_SIZE } from '../constants'
import { splitIntoChunks } from '../utils'

import { AdaptersService } from '@common/adapters'
import { Environment } from '@config/environment'
import { Artist, SdkArtist, SdkSimplifiedAlbum } from '@common/types/spotify'

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

  async topTracks(artistId: string, market: Market = 'US') {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const { tracks } = await backOff(() =>
      this.spotifySdk!.artists.topTracks(artistId, market)
    )

    return tracks
  }

  async albums(artistId: string) {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_ID)!,
      this.configService.get<string>(Environment.SPOTIFY_CLIENT_SECRET)!
    )

    const { items: albums } = await this.getArtistMissingAlbums(
      await backOff(() =>
        this.spotifySdk!.artists.albums(artistId, undefined, undefined, 50)
      ),
      artistId
    )

    return albums
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

    const chunks = splitIntoChunks(ids, CHUNK_SIZE)

    const artists = await Promise.all(
      chunks.map(chunk => backOff(() => this.spotifySdk!.artists.get(chunk)))
    )

    return artists.flat()
  }

  private async getArtistMissingAlbums(
    albumsPage: Page<SdkSimplifiedAlbum>,
    artistId: string
  ) {
    if (albumsPage.next) {
      let offset = albumsPage.offset + albumsPage.items.length

      while (albumsPage.items.length < albumsPage.total) {
        const albums = await backOff(() =>
          this.spotifySdk!.artists.albums(
            artistId,
            undefined,
            undefined,
            50,
            offset
          )
        )

        if (albums.items.length === 0) return albumsPage

        albumsPage.items.push(...albums.items)

        offset += albums.items.length
      }
    }

    return albumsPage
  }
}
