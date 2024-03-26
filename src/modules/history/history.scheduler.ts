import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'

import { HistoryRepository } from './history.repository'

import { User, UsersRepository } from '@modules/users'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyPlayerService } from '@modules/spotify/player'

@Injectable()
export class HistoryScheduler implements OnModuleInit {
  private readonly DELAY_MINUTES = 2
  private readonly DELAY_HOURS = 1

  private readonly logger = new Logger(HistoryScheduler.name)

  constructor(
    @Inject(forwardRef(() => UsersRepository))
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

  triggerFetchingUserHistory(user: User, delayMinutes = 0) {
    const DELAY_HOURS = 1000 * 60 * 60 * this.DELAY_HOURS
    const DELAY_MINUTES = 1000 * 60 * delayMinutes * this.DELAY_MINUTES
    const DELAY = DELAY_HOURS + DELAY_MINUTES

    const interval = setInterval(() => {
      this.fetchUserHistory(user)
    }, DELAY)

    this.schedulerRegistry.addInterval(`fetch-history-${user.id}`, interval)
  }

  async fetchUserHistory(user: User) {
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
