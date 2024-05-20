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

import { HistoryService } from './history.service'

import { User, UsersRepository } from '@modules/users'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyPlayerService } from '@modules/spotify/player'
import { Environment } from '@config/environment'

const { HISTORY_FETCHING_INTERVAL, HISTORY_FETCHING_DELAY } = Environment

@Injectable()
export class HistoryScheduler implements OnModuleInit {
  private readonly logger = new Logger(HistoryScheduler.name)

  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyPlayerService: SpotifyPlayerService,
    private readonly historyService: HistoryService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    const users = await this.usersRepository.findUsers()

    this.logger.log(`Scheduling history fetching for ${users.length} users`)

    for (const user of users) {
      const index = users.findIndex(({ id }) => id === user.id)

      setTimeout(
        () => {
          this.triggerFetchingUserHistory(user)
        },
        ms(this.configService.get<string>(HISTORY_FETCHING_DELAY)!) * index
      )
    }
  }

  triggerFetchingUserHistory(user: User) {
    const INTERVAL_HOURS = ms(
      this.configService.get<string>(HISTORY_FETCHING_INTERVAL)!
    )

    const interval = setInterval(() => {
      this.fetchUserHistory(user)
    }, INTERVAL_HOURS)

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

    await this.historyService.updateOrCreate(user, items)
  }
}
