import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

import { HistoryRepository } from './history.repository'

import { User, UsersRepository } from '@modules/users'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyPlayerService } from '@modules/spotify/player'

@Injectable()
export class HistoryScheduler implements OnModuleInit {
  private readonly DELAY_MINUTES = 5
  private readonly INTERVAL_HOURS = 1

  private readonly logger = new Logger(HistoryScheduler.name)

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyPlayerService: SpotifyPlayerService,
    private readonly historyRepository: HistoryRepository,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  async onModuleInit() {
    const users = await this.usersRepository.findUsers()

    let index = 0

    this.logger.log(`Scheduling history fetching for ${users.length} users`)

    for (const user of users) {
      this.triggerFetchingUserHistory(user, index)

      index++
    }
  }

  async triggerFetchingUserHistory(user: User, delayMinutes = 0) {
    const job = new CronJob(
      `* ${delayMinutes * this.DELAY_MINUTES || '*'} ${this.INTERVAL_HOURS} * * *`,
      () => this.triggerFetchingUserHistory(user)
    )

    this.schedulerRegistry.addCronJob(`fetch-history-${user.id}`, job)

    this.logger.log(`Fetching history for user ${user.profile.displayName}`)

    const accessToken = await this.spotifyAuthService.token({
      refreshToken: user.refreshToken,
    })

    const { items } = await this.spotifyPlayerService.getRecentlyPlayedTracks(
      accessToken,
      50,
      {},
      false
    )

    await this.historyRepository.updateOrCreateHistoryByUser(user, items)
  }
}
