import { Module } from '@nestjs/common'

import { HistoryModule } from '../history.module'
import { HistoryTracksModule } from '../tracks'

import { HistoryController } from './history.controller'

import { UsersModule } from '@modules/users'

@Module({
  imports: [HistoryModule, HistoryTracksModule, UsersModule],
  controllers: [HistoryController],
})
export class HistoryRouterModule {}
