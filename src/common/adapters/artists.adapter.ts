import { Injectable } from '@nestjs/common'
import { Page } from '@spotify/web-api-ts-sdk'

import { PageAdapter } from './page.adapter'

import {
  Artist,
  SdkArtist,
  SdkSimplifiedArtist,
  SimplifiedArtist,
} from '@common/types/spotify'

@Injectable()
export class ArtistsAdapter {
  constructor(private readonly pageAdapter: PageAdapter) {}

  public adapt(data: SdkArtist[]): Artist[]
  public adapt(data: SdkSimplifiedArtist[]): SimplifiedArtist[]
  public adapt(data: SdkArtist): Artist
  public adapt(data: SdkSimplifiedArtist): SimplifiedArtist
  public adapt(data: Page<SdkArtist>): Page<Artist>

  adapt(
    data:
      | SdkArtist
      | SdkSimplifiedArtist
      | (SdkArtist | SdkSimplifiedArtist)[]
      | Page<SdkArtist>
  ) {
    if (Array.isArray(data)) return this.adaptArtists(data)

    if ('offset' in data) return this.adaptArtistsPage(data)

    return this.adaptArtist(data)
  }

  adaptArtist = ({
    name,
    id,
    external_urls: { spotify: href },
    ...rest
  }: SdkArtist | SdkSimplifiedArtist): Artist | SimplifiedArtist => ({
    id,
    name,
    href,
    ...('genres' in rest && {
      genres: rest.genres,
      images: rest.images,
      popularity: rest.popularity,
    }),
  })

  adaptArtists(
    artists: (SdkArtist | SdkSimplifiedArtist)[]
  ): (Artist | SimplifiedArtist)[] {
    return artists.map(artist => this.adaptArtist(artist))
  }

  adaptArtistsPage(data: Page<SdkArtist>) {
    return this.pageAdapter.adapt(data, artists => this.adaptArtists(artists))
  }
}
