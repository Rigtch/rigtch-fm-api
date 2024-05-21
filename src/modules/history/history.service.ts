import { Injectable } from '@nestjs/common'
import { PlayHistory } from '@spotify/web-api-ts-sdk'

import { HistoryTracksRepository, HistoryTracksService } from './tracks'

import { User } from '@modules/users'

@Injectable()
export class HistoryService {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly historyTracksService: HistoryTracksService
  ) {}

  async synchronize(user: User, playHistory: PlayHistory[]) {
    const lastHistoryTrack =
      await this.historyTracksRepository.findLastHistoryTrackByUser(user.id)

    if (lastHistoryTrack) {
      const latestTrackIndex = playHistory.findIndex(
        ({ track, played_at }) =>
          track.id === lastHistoryTrack.track.externalId &&
          new Date(played_at).getTime() === lastHistoryTrack.playedAt.getTime()
      )

      const latestPlayHistory = playHistory.filter((_, index) =>
        latestTrackIndex === -1 ? true : index > latestTrackIndex
      )

      await this.historyTracksService.create(latestPlayHistory, user)
    } else await this.historyTracksService.create(playHistory, user)
  }
}
