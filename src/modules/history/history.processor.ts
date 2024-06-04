import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'

import { HISTORY_QUEUE, SYNCHRONIZE_JOB } from './constants'
import { HistoryTracksRepository, HistoryTracksService } from './tracks'

import { User } from '@modules/users/user.entity'
import { SpotifyService } from '@modules/spotify'

@Processor(HISTORY_QUEUE)
export class HistoryProcessor {
  private readonly logger = new Logger(HistoryProcessor.name)

  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly historyTracksService: HistoryTracksService,
    private readonly spotifyService: SpotifyService
  ) {}

  @Process(SYNCHRONIZE_JOB)
  async synchronize({ data: user }: Job<User>) {
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

      if (latestPlayHistory.length > 0)
        await this.historyTracksService.create(latestPlayHistory, user)
      else
        this.logger.log(
          `No new tracks found for user: ${user.profile.displayName} - skipping synchronization`
        )
    } else await this.historyTracksService.create(playHistory, user)
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.error(error)
  }

  @OnQueueFailed()
  onFailed({ data: { profile } }: Job<User>, error: Error) {
    this.logger.error(
      `History synchronization failed for user: ${profile.displayName}`
    )
    this.logger.error(error)
  }

  @OnQueueActive()
  onActive({ data: { profile } }: Job<User>) {
    this.logger.log(
      `Processing history synchronization for user: ${profile.displayName}...`
    )
  }

  @OnQueueCompleted()
  onCompleted({ data: { profile } }: Job<User>) {
    this.logger.log(
      `History synchronization completed for user: ${profile.displayName}`
    )
  }

  @OnQueueStalled()
  onStalled({ data: { profile } }: Job<User>) {
    this.logger.error(
      `History synchronization stalled for user: ${profile.displayName}`
    )
  }
}
