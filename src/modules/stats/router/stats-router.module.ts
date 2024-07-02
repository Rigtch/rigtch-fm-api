import { Module } from '@nestjs/common'

import { StatsModule } from '../stats.module'

import { StatsRigtchController } from './stats-rigtch.controller'

import { UsersModule } from '@modules/users'

@Module({
  imports: [StatsModule, UsersModule],
  controllers: [StatsRigtchController],
})
export class StatsRouterModule {}
