import { Injectable } from '@nestjs/common'
import { Between } from 'typeorm'

import type { StatsRigtchQuery } from './router/dtos'
import { StatsMeasurement } from './enums'
import type { TopItem } from './types'

import { HistoryTracksRepository } from '@modules/history/tracks'
import type { User } from '@modules/users'
import {
  getMostFrequentItems,
  getMostListenedTracksByDuration,
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
    const historyTracks = await this.historyTracksRepository.find({
      where: {
        user: {
          id: user.id,
        },
        playedAt: Between(after, before),
      },
      relations: {
        track: {
          artists: true,
          album: true,
        },
      },
    })
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

    const mostListenedTrackByDuration = getMostListenedTracksByDuration(
      tracks,
      limit
    )

    return mostListenedTrackByDuration.map(id => ({
      item: tracks.find(track => track.id === id)!,
      playTime: 1,
    }))
  }
}
