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
        before
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
      playTime: totalDuration,
    }))
  }

  async getTopArtists(
    { before, after, limit, measurement }: Required<StatsRigtchQuery>,
    user: User
  ) {
    const historyTracks =
      await this.historyTracksRepository.findByUserAndBetweenDates(
        user.id,
        after,
        before
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
      playTime: totalDuration,
    }))
  }
}
