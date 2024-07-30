import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job, Queue } from 'bullmq'
import { Logger, UnauthorizedException } from '@nestjs/common'

import { HISTORY_QUEUE } from './constants'
import { HistoryTracksRepository, HistoryTracksService } from './tracks'
import { InjectHistoryQueue } from './decorators'

import { User } from '@modules/users/user.entity'
import { SpotifyService } from '@modules/spotify'

@Processor(HISTORY_QUEUE)
export class HistoryProcessor extends WorkerHost {
  private readonly logger = new Logger(HistoryProcessor.name)

  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly historyTracksService: HistoryTracksService,
    private readonly spotifyService: SpotifyService,
    @InjectHistoryQueue() private readonly historyQueue: Queue<User>
  ) {
    super()
  }

  async process({ data: user }: Job<User>) {
    const accessToken = await this.spotifyService.auth.token({
      refreshToken: user.refreshToken,
    })

    const { items: playHistory } =
      await this.spotifyService.player.getRecentlyPlayedTracks(
        accessToken,
        5,
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

  @OnWorkerEvent('error')
  onError(error: Error) {
    this.logger.error(error)
  }

  @OnWorkerEvent('failed')
  onFailed({ data: { profile }, id, repeatJobKey }: Job<User>, error: Error) {
    this.logger.error(
      `History synchronization failed for user: ${profile.displayName}`
    )
    this.logger.error(error)

    if (
      error instanceof UnauthorizedException &&
      error.message === 'Invalid token' &&
      id
    ) {
      this.historyQueue.remove(id)

      this.logger.warn(`Job has been removed from the queue`)

      if (repeatJobKey) {
        this.historyQueue.removeRepeatableByKey(repeatJobKey)

        this.logger.warn(
          `Repeatable job for user ${profile.displayName} has been removed from the queue`
        )
      }
    }
  }

  @OnWorkerEvent('active')
  onActive({ data: { profile } }: Job<User>) {
    this.logger.log(
      `Processing history synchronization for user: ${profile.displayName}...`
    )
  }

  @OnWorkerEvent('completed')
  onCompleted({ data: { profile } }: Job<User>) {
    this.logger.log(
      `History synchronization completed for user: ${profile.displayName}`
    )
  }

  @OnWorkerEvent('stalled')
  onStalled({ data: { profile } }: Job<User>) {
    this.logger.error(
      `History synchronization stalled for user: ${profile.displayName}`
    )
  }
}
