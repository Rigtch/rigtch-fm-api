import { Injectable } from '@nestjs/common'

import { HistoryTracksRepository, HistoryTracksService } from './tracks'

import { User } from '@modules/users'
import { SpotifyService } from '@modules/spotify'

@Injectable()
export class HistoryService {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly historyTracksService: HistoryTracksService,
    private readonly spotifyService: SpotifyService
  ) {}

  async synchronize(user: User) {
    const accessToken = await this.spotifyService.auth.token({
      refreshToken: user.refreshToken,
    })

    const { items: playHistory } =
      await this.spotifyService.player.getRecentlyPlayedTracks(
        accessToken,
        50,
        {},
        false
      )

    const lastHistoryTrack =
      await this.historyTracksRepository.findLastHistoryTrackByUser(user.id)

    if (lastHistoryTrack) {
      const latestTrackIndex = playHistory.findIndex(
        ({ track, played_at }) =>
          track.id === lastHistoryTrack.track.externalId &&
          new Date(played_at).getTime() === lastHistoryTrack.playedAt.getTime()
      )

      const latestPlayHistory = playHistory.filter((_, index) =>
        latestTrackIndex === -1 ? true : index < latestTrackIndex
      )

      await this.historyTracksService.create(latestPlayHistory, user)
    } else await this.historyTracksService.create(playHistory, user)
  }
}
