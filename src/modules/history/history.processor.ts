import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job, Queue } from 'bullmq'
import { Logger, UnauthorizedException } from '@nestjs/common'

import { HISTORY_QUEUE } from './constants'
import { InjectHistoryQueue } from './decorators'
import { HistoryService } from './history.service'

import { EnvService } from '@config/env'
import { User } from '@modules/users/user.entity'

@Processor(HISTORY_QUEUE)
export class HistoryProcessor extends WorkerHost {
  private readonly logger = new Logger(HistoryProcessor.name)

  constructor(
    private readonly historyService: HistoryService,
    private readonly envService: EnvService,
    @InjectHistoryQueue() private readonly historyQueue: Queue<User>
  ) {
    super()
  }

  async process({ data: user }: Job<User>) {
    if (!this.envService.get('ENABLE_HISTORY_SYNCHRONIZATION')) return

    const synchronizedTracks = await this.historyService.synchronize(user)

    if (synchronizedTracks.length === 0)
      this.logger.log(
        `No new tracks found for user: ${user.profile.displayName} - skipping synchronization`
      )
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
        // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation
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
