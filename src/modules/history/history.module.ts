import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'

import { History } from './history.entity'
import { HistoryRepository } from './history.repository'
import { HistoryScheduler } from './history.scheduler'
import { HistoryTracksModule } from './tracks'
import { HistoryService } from './history.service'

import { UsersModule } from '@modules/users'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
    ScheduleModule.forRoot(),
    forwardRef(() => UsersModule),
    SpotifyModule,
    HistoryTracksModule,
  ],
  providers: [HistoryRepository, HistoryScheduler, HistoryService],
  exports: [HistoryRepository, HistoryScheduler, HistoryService],
})
export class HistoryModule {}
