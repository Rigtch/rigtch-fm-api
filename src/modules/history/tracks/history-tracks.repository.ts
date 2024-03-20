import { Injectable } from '@nestjs/common'
import {
  DataSource,
  FindOptionsOrder,
  FindOptionsRelations,
  Repository,
} from 'typeorm'
import { PlayHistory } from '@spotify/web-api-ts-sdk'

import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

import { TracksRepository } from '@modules/tracks'
import { User } from '@modules/users'

export const relations: FindOptionsRelations<HistoryTrack> = {
  user: true,
}
export const order: FindOptionsOrder<HistoryTrack> = {
  playedAt: 'DESC',
}

@Injectable()
export class HistoryTracksRepository extends Repository<HistoryTrack> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tracksRepository: TracksRepository
  ) {
    super(HistoryTrack, dataSource.createEntityManager())
  }

  findHistoryTracksByUser(userId: string) {
    return this.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations,
      order,
    })
  }

  findLastHistoryTrackByUser(userId: string) {
    return this.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations,
      order,
    })
  }

  createHistoryTrack(newHistoryTrack: CreateHistoryTrack) {
    const historyTrack = this.create(newHistoryTrack)

    return this.save(historyTrack)
  }

  async createHistoryTracksFromPlayHistory(
    playHistory: PlayHistory[],
    user: User
  ) {
    const tracks = await this.tracksRepository.findOrCreateTracks(
      playHistory.map(({ track }) => track)
    )

    const historyTracks: HistoryTrack[] = []

    for (const track of tracks) {
      const playedAt = new Date(
        playHistory.find(
          ({ track: { id } }) => id === track.externalId
        )!.played_at
      )

      const newHistoryTrack = await this.createHistoryTrack({
        user,
        playedAt,
        track,
      })

      historyTracks.push(newHistoryTrack)
    }

    return historyTracks
  }
}
