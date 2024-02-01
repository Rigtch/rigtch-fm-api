import { Injectable } from '@nestjs/common'
import { Page } from '@spotify/web-api-ts-sdk'

import { PageAdapter } from './page.adapter'
import { ArtistsAdapter } from './artists.adapter'

import {
  RecentlyPlayedTracksPage,
  SdkRecentlyPlayedTracksPage,
  SdkTrack,
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
  public adapt(data: Page<SdkTrack>): Page<Track>
  public adapt(data: SdkRecentlyPlayedTracksPage): RecentlyPlayedTracksPage

  adapt(
    data: SdkTrack | SdkTrack[] | Page<SdkTrack> | SdkRecentlyPlayedTracksPage
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
    album,
    artists,
    external_urls: { spotify: href },
    duration_ms,
  }: SdkTrack): Track => ({
    id,
    name,
    album: {
      id: album.id,
      name: album.name,
      images: album.images,
      href: album.external_urls.spotify,
      artists: this.artistsAdapter.adapt(album.artists),
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
    },
    artists: this.artistsAdapter.adapt(artists),
    href,
    duration: duration_ms,
  })

  adaptTracks(tracks: SdkTrack[]): Track[] {
    return tracks.map(track => this.adaptTrack(track))
  }

  adaptTracksPage = (data: Page<SdkTrack>): Page<Track> => {
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
        ...this.adaptTrack(track),
        playedAt: played_at,
      })),
      total: items.length,
    }
  }
}
