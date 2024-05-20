import { Module, forwardRef } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { HistoryScheduler } from './history.scheduler'
import { HistoryTracksModule } from './tracks'
import { HistoryService } from './history.service'

import { UsersModule } from '@modules/users'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => UsersModule),
    SpotifyModule,
    HistoryTracksModule,
  ],
  providers: [HistoryScheduler, HistoryService],
  exports: [HistoryScheduler, HistoryService],
})
export class HistoryModule {}
