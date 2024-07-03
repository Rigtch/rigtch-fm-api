import { Module } from '@nestjs/common'

import { StatsModule } from '../stats.module'

import { StatsRigtchController } from './stats-rigtch.controller'
import { StatsSpotifyController } from './stats-spotify.controller'

import { UsersModule } from '@modules/users'
import { ItemsModule } from '@modules/items'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [StatsModule, UsersModule, ItemsModule, SpotifyModule],
  controllers: [StatsRigtchController, StatsSpotifyController],
})
export class StatsRouterModule {}
