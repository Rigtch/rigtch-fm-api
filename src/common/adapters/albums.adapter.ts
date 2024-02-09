import { Injectable } from '@nestjs/common'

import { TracksAdapter } from './tracks.adapter'
import { ArtistsAdapter } from './artists.adapter'

import {
  Album,
  SdkAlbum,
  SdkSimplifiedAlbum,
  SimplifiedAlbum,
} from '@common/types/spotify'

@Injectable()
export class AlbumsAdapter {
  constructor(
    private readonly tracksAdapter: TracksAdapter,
    private readonly artistsAdapter: ArtistsAdapter
  ) {}

  public adapt(data: SdkAlbum): Album
  public adapt(data: SdkAlbum[]): Album[]
  public adapt(data: SdkSimplifiedAlbum): SimplifiedAlbum
  public adapt(data: SdkSimplifiedAlbum[]): SimplifiedAlbum[]

  adapt(
    data: SdkAlbum | SdkSimplifiedAlbum | (SdkAlbum | SdkSimplifiedAlbum)[]
  ): Album | SimplifiedAlbum | (Album | SimplifiedAlbum)[] {
    if (Array.isArray(data)) {
      return this.adaptAlbums(data)
    }

    return this.adaptAlbum(data)
  }

  adaptAlbum = ({
    id,
    name,
    external_urls: { spotify: href },
    genres,
    popularity,
    images,
    release_date,
    total_tracks,
    ...rest
  }: SdkAlbum | SdkSimplifiedAlbum): Album | SimplifiedAlbum => ({
    id,
    name,
    href,
    genres,
    popularity,
    images,
    releaseDate: release_date,
    totalTracks: total_tracks,
    ...('tracks' in rest && {
      tracks: this.tracksAdapter.adapt(rest.tracks),
      artists: this.artistsAdapter.adapt(rest.artists),
    }),
  })

  adaptAlbums(
    albums: (SdkAlbum | SdkSimplifiedAlbum)[]
  ): (Album | SimplifiedAlbum)[] {
    return albums.map((album: SdkAlbum | SdkSimplifiedAlbum) =>
      this.adaptAlbum(album)
    )
  }
}
