import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  forwardRef,
} from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import ms from 'ms'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

import { HISTORY_QUEUE, SYNCHRONIZE_JOB } from './constants'
import { synchronizeJobIdFactory } from './utils'

import { User } from '@modules/users/user.entity'
import { UsersRepository } from '@modules/users/users.repository'
import { Environment } from '@config/environment'

const { HISTORY_FETCHING_INTERVAL, ENABLE_HISTORY_SYNCHRONIZATION } =
  Environment

@Injectable()
export class HistoryScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(HistoryScheduler.name)

  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    @InjectQueue(HISTORY_QUEUE) private readonly historyQueue: Queue<User>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService
  ) {}

  onApplicationBootstrap() {
    if (
      this.configService.get<boolean>(ENABLE_HISTORY_SYNCHRONIZATION) === false
    ) {
      this.logger.log('History synchronization is disabled')
      return
    }

    const INTERVAL_HOURS = ms(
      this.configService.get<string>(HISTORY_FETCHING_INTERVAL)!
    )

    this.scheduleHistorySynchronization()

    const interval = setInterval(() => {
      this.scheduleHistorySynchronization()
    }, INTERVAL_HOURS)

    this.schedulerRegistry.addInterval('history-synchronization', interval)
  }

  async scheduleHistorySynchronization() {
    const users = await this.usersRepository.findUsers()

    this.logger.log(`Adding synchronize jobs for ${users.length} users`)

    for (const user of users) {
      await this.historyQueue.add(SYNCHRONIZE_JOB, user, {
        priority: 1,
        jobId: synchronizeJobIdFactory(user.id),
      })
    }
  }
}
