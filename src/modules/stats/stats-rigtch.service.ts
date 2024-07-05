import { Injectable } from '@nestjs/common'

import type { StatsRigtchQuery } from './router/dtos'
import { StatsMeasurement } from './enums'
import type { TopItem } from './types'

import { HistoryTracksRepository } from '@modules/history/tracks'
import type { User } from '@modules/users'
import {
  getMostFrequentItems,
  getMostListenedItemsByDuration,
} from '@common/utils'
import type { Track } from '@modules/items/tracks'
import type { Artist } from '@modules/items/artists'
import type { Album } from '@modules/items/albums'

@Injectable()
export class StatsRigtchService {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository
  ) {}

  async getTopTracks(
    { before, after, limit, measurement }: Required<StatsRigtchQuery>,
    user: User
  ): Promise<TopItem<Track>[]> {
    const historyTracks =
      await this.historyTracksRepository.findByUserAndBetweenDates(
        user.id,
        after,
        before,
        {
          track: {
            artists: true,
            album: true,
          },
        }
      )
    const tracks = historyTracks.map(({ track }) => track)

    if (measurement === StatsMeasurement.PLAYS) {
      const mostFrequentItems = getMostFrequentItems(
        tracks.map(track => track.id),
        limit
      )

      return mostFrequentItems.map(({ item: id, count }) => ({
        item: tracks.find(track => track.id === id)!,
        plays: count,
      }))
    }

    const mostListenedTrackByDuration = getMostListenedItemsByDuration(
      tracks,
      limit
    )

    return mostListenedTrackByDuration.map(({ id, totalDuration }) => ({
      item: tracks.find(track => track.id === id)!,
      playtime: totalDuration,
    }))
  }

  async getTopArtists(
    { before, after, limit, measurement }: Required<StatsRigtchQuery>,
    user: User
  ): Promise<TopItem<Artist>[]> {
    const historyTracks =
      await this.historyTracksRepository.findByUserAndBetweenDates(
        user.id,
        after,
        before,
        {
          track: {
            artists: true,
          },
        }
      )
    const tracks = historyTracks.map(({ track }) => track)
    const artists = tracks.flatMap(({ artists }) => artists)

    if (measurement === StatsMeasurement.PLAYS) {
      const mostFrequentItems = getMostFrequentItems(
        artists.map(artist => artist.id),
        limit
      )

      return mostFrequentItems.map(({ item: id, count }) => ({
        item: artists.find(artist => artist.id === id)!,
        plays: count,
      }))
    }

    const mostListenedArtistByDuration = getMostListenedItemsByDuration(
      tracks.flatMap(({ artists, duration }) =>
        artists.map(({ id }) => ({ id, duration }))
      ),
      limit
    )

    return mostListenedArtistByDuration.map(({ id, totalDuration }) => ({
      item: artists.find(artist => artist.id === id)!,
      playtime: totalDuration,
    }))
  }

  async getTopAlbums(
    { before, after, limit, measurement }: Required<StatsRigtchQuery>,
    user: User
  ): Promise<TopItem<Album>[]> {
    const historyTracks =
      await this.historyTracksRepository.findByUserAndBetweenDates(
        user.id,
        after,
        before,
        {
          track: {
            album: {
              artists: true,
            },
          },
        }
      )
    const tracks = historyTracks.map(({ track }) => track)
    const albums = tracks.flatMap(({ album }) => album)

    if (measurement === StatsMeasurement.PLAYS) {
      const mostFrequentItems = getMostFrequentItems(
        albums.map(album => album!.id),
        limit
      )

      return mostFrequentItems.map(({ item: id, count }) => ({
        item: albums.find(album => album!.id === id)!,
        plays: count,
      }))
    }

    const mostListenedAlbumByDuration = getMostListenedItemsByDuration(
      tracks.flatMap(({ album, duration }) => ({
        id: album!.id,
        duration,
      })),
      limit
    )

    return mostListenedAlbumByDuration.map(({ id, totalDuration }) => ({
      item: albums.find(album => album!.id === id)!,
      playtime: totalDuration,
    }))
  }

  async getTopGenres(
    { before, after, limit, measurement }: Required<StatsRigtchQuery>,
    user: User
  ): Promise<TopItem<string>[]> {
    const historyTracks =
      await this.historyTracksRepository.findByUserAndBetweenDates(
        user.id,
        after,
        before,
        {
          track: {
            artists: true,
          },
        }
      )
    const tracks = historyTracks.map(({ track }) => track)
    const artists = tracks.flatMap(({ artists }) => artists)
    const genres = artists.flatMap(({ genres }) => genres)

    if (measurement === StatsMeasurement.PLAYS) {
      const mostFrequentItems = getMostFrequentItems(genres, limit)

      return mostFrequentItems.map(({ item, count }) => ({
        item,
        plays: count,
      }))
    }

    const mostListenedGenreByDuration = getMostListenedItemsByDuration(
      tracks.flatMap(({ artists, duration }) =>
        artists
          .flatMap(({ genres }) => genres)
          .map(genre => ({ id: genre, duration }))
      ),
      limit
    )

    return mostListenedGenreByDuration.map(({ id, totalDuration }) => ({
      item: id,
      playtime: totalDuration,
    }))
  }
}
