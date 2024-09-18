import { Injectable } from '@nestjs/common'

import { HistoryTracksRepository, HistoryTracksService } from './tracks'

import { SpotifyService } from '@modules/spotify'
import type { User } from '@modules/users'

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

    const lastHistoryTrack =
      await this.historyTracksRepository.findLastHistoryTrackByUser(user.id)

    if (!lastHistoryTrack) {
      const { items: playHistory } =
        await this.spotifyService.player.getRecentlyPlayedTracks(
          accessToken,
          50,
          {},
          false
        )

      return this.historyTracksService.create(playHistory, user)
    }

    const {
      items: [lastPlayHistoryItem],
    } = await this.spotifyService.player.getRecentlyPlayedTracks(
      accessToken,
      1,
      {},
      false
    )

    const lastPlayHistoryPlayedAt = new Date(lastPlayHistoryItem.played_at)

    if (
      lastPlayHistoryItem.track.id === lastHistoryTrack.track.externalId ||
      lastPlayHistoryPlayedAt.getTime() === lastHistoryTrack.playedAt.getTime()
    )
      return []

    const { items: playHistory } =
      await this.spotifyService.player.getRecentlyPlayedTracks(
        accessToken,
        50,
        {},
        false
      )

    const latestTrackIndex = playHistory.findIndex(
      ({ track, played_at }) =>
        track.id === lastHistoryTrack.track.externalId &&
        new Date(played_at).getTime() === lastHistoryTrack.playedAt.getTime()
    )

    const latestPlayHistory = playHistory.filter((_, index) =>
      latestTrackIndex === -1 ? true : index < latestTrackIndex
    )

    return this.historyTracksService.create(latestPlayHistory, user)
  }
}
