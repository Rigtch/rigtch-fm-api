import { Injectable } from '@nestjs/common'
import { Page } from '@spotify/web-api-ts-sdk'

import { PageAdapter } from './page.adapter'
import { ArtistsAdapter } from './artists.adapter'

import {
  RecentlyPlayedTracksPage,
  SdkRecentlyPlayedTracksPage,
  SdkSimplifiedTrack,
  SdkTrack,
  SimplifiedTrack,
  Track,
} from '@common/types/spotify'

@Injectable()
export class TracksAdapter {
  constructor(
    private readonly pageAdapter: PageAdapter,
    private readonly artistsAdapter: ArtistsAdapter
  ) {}

  public adapt(data: SdkTrack): Track
  public adapt(data: SdkTrack[]): Track[]
  public adapt(data: SdkSimplifiedTrack): SimplifiedTrack
  public adapt(data: SdkSimplifiedTrack[]): SimplifiedTrack[]
  public adapt(data: Page<SdkTrack>): Page<Track>
  public adapt(data: Page<SdkSimplifiedTrack>): Page<SimplifiedTrack>
  public adapt(data: SdkRecentlyPlayedTracksPage): RecentlyPlayedTracksPage

  adapt(
    data:
      | SdkTrack
      | SdkSimplifiedTrack
      | SdkTrack[]
      | SdkSimplifiedTrack[]
      | Page<SdkTrack>
      | Page<SdkSimplifiedTrack>
      | SdkRecentlyPlayedTracksPage
  ) {
    if (Array.isArray(data)) return this.adaptTracks(data)
    if ('items' in data) {
      if ('cursors' in data) return this.adaptRecentlyPlayedTracksPage(data)

      return this.adaptTracksPage(data)
    }

    return this.adaptTrack(data)
  }

  adaptTrack = ({
    id,
    name,
    artists,
    external_urls: { spotify: href },
    duration_ms,
    track_number,
    disc_number,
    ...rest
  }: SdkTrack | SdkSimplifiedTrack): Track | SimplifiedTrack => ({
    id,
    name,
    ...('album' in rest && {
      album: {
        id: rest.album.id,
        name: rest.album.name,
        images: rest.album.images,
        href: rest.album.external_urls.spotify,
        genres: rest.album.genres,
        popularity: rest.album.popularity,
        releaseDate: rest.album.release_date,
        releaseDatePrecision: rest.album.release_date_precision,
        totalTracks: rest.album.total_tracks,
      },
    }),
    artists: this.artistsAdapter.adapt(artists),
    href,
    duration: duration_ms,
    trackNumber: track_number,
    discNumber: disc_number,
  })

  adaptTracks(
    tracks: (SdkTrack | SdkSimplifiedTrack)[]
  ): (Track | SimplifiedTrack)[] {
    return tracks.map(track => this.adaptTrack(track))
  }

  adaptTracksPage(data: Page<SdkTrack | SdkSimplifiedTrack>) {
    return this.pageAdapter.adapt(data, tracks => this.adaptTracks(tracks))
  }

  adaptRecentlyPlayedTracksPage({
    limit,
    next,
    href,
    cursors,
    items,
  }: SdkRecentlyPlayedTracksPage): RecentlyPlayedTracksPage {
    return {
      limit,
      next,
      href,
      cursors,
      items: items.map(({ track, played_at }) => ({
        ...(this.adaptTrack(track) as Track),
        playedAt: played_at,
      })),
      total: items.length,
    }
  }
}
