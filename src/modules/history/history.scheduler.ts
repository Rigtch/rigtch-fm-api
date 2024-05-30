import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import ms from 'ms'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

import { HISTORY_QUEUE, SYNCHRONIZE_JOB } from './constants'

import { User, UsersRepository } from '@modules/users'
import { Environment } from '@config/environment'

const { HISTORY_FETCHING_INTERVAL, HISTORY_FETCHING_DELAY } = Environment

@Injectable()
export class HistoryScheduler implements OnModuleInit {
  private readonly logger = new Logger(HistoryScheduler.name)

  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    @InjectQueue(HISTORY_QUEUE) private readonly historyQueue: Queue<User>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
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
      const index = users.findIndex(({ id }) => id === user.id)

      await this.historyQueue.add(SYNCHRONIZE_JOB, user, {
        priority: 1,
        delay:
          ms(this.configService.get<string>(HISTORY_FETCHING_DELAY)!) * index,
      })
    }
  }
}
