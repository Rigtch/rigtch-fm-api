import { Injectable } from '@nestjs/common'
import {
  Page,
  SimplifiedArtist,
  Artist as SpotifyArtist,
} from '@spotify/web-api-ts-sdk'

import { PaginatedAdapter } from './paginated.adapter'

import { Artist, TrackArtist } from '@common/types/spotify'

@Injectable()
export class ArtistsAdapter {
  constructor(private readonly paginatedAdapter: PaginatedAdapter) {}

  public adapt(data: SpotifyArtist[]): Artist[]
  public adapt(data: SimplifiedArtist[]): TrackArtist[]
  public adapt(data: SpotifyArtist): Artist
  public adapt(data: SimplifiedArtist): TrackArtist
  public adapt(data: Page<SpotifyArtist>): Page<Artist>

  adapt(
    data:
      | SpotifyArtist
      | SimplifiedArtist
      | (SpotifyArtist | SimplifiedArtist)[]
      | Page<SpotifyArtist>
  ) {
    if (Array.isArray(data)) return this.adaptArtists(data)

    if ('offset' in data) return this.adaptPaginatedArtists(data)

    return this.adaptArtist(data)
  }

  adaptArtist({
    name,
    id,
    external_urls: { spotify: href },
    ...rest
  }: SpotifyArtist | SimplifiedArtist): Artist | TrackArtist {
    console.log(href)

    return {
      id,
      name,
      href,
      ...('genres' in rest && {
        genres: rest.genres,
        images: rest.images,
        popularity: rest.popularity,
      }),
    }
  }

  adaptArtists(
    artists: (SpotifyArtist | SimplifiedArtist)[]
  ): (Artist | TrackArtist)[] {
    return artists.map(artist => this.adaptArtist(artist))
  }

  adaptPaginatedArtists(data: Page<SpotifyArtist>) {
    return this.paginatedAdapter.adapt(data, artists =>
      this.adaptArtists(artists)
    )
  }
}
