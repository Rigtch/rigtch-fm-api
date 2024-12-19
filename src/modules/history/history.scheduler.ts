import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  forwardRef,
} from '@nestjs/common'
import { Queue } from 'bullmq'

import { SYNCHRONIZE_JOB } from './constants'
import { synchronizeJobIdFactory } from './utils'
import { InjectHistoryQueue } from './decorators'

import { EnvService } from '@config/env'
import { User } from '@modules/users/user.entity'
import { UsersRepository } from '@modules/users/users.repository'

@Injectable()
export class HistoryScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(HistoryScheduler.name)

  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    @InjectHistoryQueue() private readonly historyQueue: Queue<User>,
    private readonly envService: EnvService
  ) {}

  onApplicationBootstrap() {
    if (this.envService.get('ENABLE_HISTORY_SYNCHRONIZATION'))
      return this.scheduleHistorySynchronization()

    this.logger.log('History synchronization is disabled')
  }

  async scheduleHistorySynchronization() {
    const users = await this.usersRepository.find()

    this.logger.log(`Adding synchronize jobs for ${users.length} users`)

    for (const user of users) {
      await this.scheduleHistorySynchronizationForUser(user)
    }
  }

  async scheduleHistorySynchronizationForUser(user: User) {
    const jobId = synchronizeJobIdFactory(user.id, true)
    // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation
    const repeatableJobs = await this.historyQueue.getRepeatableJobs()

    for (const synchronizeJob of repeatableJobs)
      if (synchronizeJob.id === jobId)
        // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation
        await this.historyQueue.removeRepeatableByKey(synchronizeJob.key)

    this.logger.log(
      `Adding repeatable synchronize job for user: ${user.profile.displayName}`
    )

    await this.historyQueue.add(SYNCHRONIZE_JOB, user, {
      priority: 1,
      repeat: {
        pattern: this.envService.get('HISTORY_SYNCHRONIZATION_CRONTIME'),
      },
      attempts: 3,
      jobId,
    })
  }
}
