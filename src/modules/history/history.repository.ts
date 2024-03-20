import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { PlayHistory } from '@spotify/web-api-ts-sdk'

import { History } from './history.entity'
import { HistoryTracksRepository } from './tracks'

import { User } from '@modules/users'

@Injectable()
export class HistoryRepository extends Repository<History> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly historyTracksRepository: HistoryTracksRepository
  ) {
    super(History, dataSource.createEntityManager())
  }

  findHistoryByUser(userId: string) {
    return this.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    })
  }

  async updateOrCreateHistoryByUser(user: User, playHistory: PlayHistory[]) {
    const foundHistory = await this.findHistoryByUser(user.id)

    if (!foundHistory) {
      const historyTracks =
        await this.historyTracksRepository.createHistoryTracksFromPlayHistory(
          playHistory,
          user
        )

      const newHistory = this.create({
        user,
        historyTracks,
      })

      return this.save(newHistory)
    }

    const lastHistoryTrack =
      await this.historyTracksRepository.findLastHistoryTrackByUser(
        foundHistory.user.id
      )

    if (lastHistoryTrack) {
      const latestPlayHistory = playHistory.filter(
        (_, index) =>
          index <
          playHistory.findIndex(
            ({ track, played_at }) =>
              track.id === lastHistoryTrack.track.externalId &&
              new Date(played_at).getTime() ===
                lastHistoryTrack.playedAt.getTime()
          )
      )

      const newHistoryTracks =
        await this.historyTracksRepository.createHistoryTracksFromPlayHistory(
          latestPlayHistory,
          user
        )

      foundHistory.historyTracks.push(...newHistoryTracks)

      return this.save(foundHistory)
    }

    const newHistoryTracks =
      await this.historyTracksRepository.createHistoryTracksFromPlayHistory(
        playHistory,
        user
      )

    foundHistory.historyTracks.push(...newHistoryTracks)

    return this.save(foundHistory)
  }
}
