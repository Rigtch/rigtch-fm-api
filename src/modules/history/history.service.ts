import { Injectable } from '@nestjs/common'
import { PlayHistory } from '@spotify/web-api-ts-sdk'

import { HistoryRepository } from './history.repository'
import { HistoryTracksRepository, HistoryTracksService } from './tracks'

import { User } from '@modules/users'

@Injectable()
export class HistoryService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly historyTracksService: HistoryTracksService
  ) {}

  async updateOrCreate(user: User, playHistory: PlayHistory[]) {
    const foundHistory = await this.historyRepository.findHistoryByUser(user.id)

    if (!foundHistory) {
      const historyTracks = await this.historyTracksService.create(
        playHistory,
        user
      )

      const newHistory = this.historyRepository.create({
        user,
        historyTracks,
      })

      return this.historyRepository.save(newHistory)
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

      const newHistoryTracks = await this.historyTracksService.create(
        latestPlayHistory,
        user
      )

      foundHistory.historyTracks.push(...newHistoryTracks)

      return this.historyRepository.save(foundHistory)
    }

    const newHistoryTracks = await this.historyTracksService.create(
      playHistory,
      user
    )

    foundHistory.historyTracks.push(...newHistoryTracks)

    return this.historyRepository.save(foundHistory)
  }
}
