import { Injectable } from '@nestjs/common'
import {
  Page,
  RecentlyPlayedTracksPage,
  Track as SpotifyTrack,
} from '@spotify/web-api-ts-sdk'

import { PaginatedAdapter } from './paginated.adapter'
import { ArtistsAdapter } from './artists.adapter'

import { SpotifyResponseWithCursors, Track } from '@common/types/spotify'

@Injectable()
export class TracksAdapter {
  constructor(
    private readonly paginatedAdapter: PaginatedAdapter,
    private readonly artistsAdapter: ArtistsAdapter
  ) {}

  public adapt(data: SpotifyTrack): Track
  public adapt(data: SpotifyTrack[]): Track[]
  public adapt(data: Page<SpotifyTrack>): Page<Track>
  public adapt(
    data: RecentlyPlayedTracksPage
  ): SpotifyResponseWithCursors<Track>

  adapt(
    data:
      | SpotifyTrack
      | SpotifyTrack[]
      | Page<SpotifyTrack>
      | RecentlyPlayedTracksPage
  ) {
    if (Array.isArray(data)) return this.adaptTracks(data)
    if ('items' in data) {
      if ('cursors' in data) return this.adaptRecentlyPlayed(data)

      return this.adaptPaginatedTracks(data)
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
  }: SpotifyTrack): Track => ({
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

  adaptTracks(tracks: SpotifyTrack[]): Track[] {
    return tracks.map(track => this.adaptTrack(track))
  }

  adaptPaginatedTracks = (data: Page<SpotifyTrack>): Page<Track> => {
    return this.paginatedAdapter.adapt(data, tracks => this.adaptTracks(tracks))
  }

  adaptRecentlyPlayed({
    limit,
    next,
    href,
    cursors,
    items,
  }: RecentlyPlayedTracksPage): SpotifyResponseWithCursors<Track> {
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
