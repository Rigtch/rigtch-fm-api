import { Module, forwardRef } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { BullModule } from '@nestjs/bull'

import { HistoryScheduler } from './history.scheduler'
import { HistoryTracksModule } from './tracks'
import { HISTORY_QUEUE } from './constants'
import { HistoryProcessor } from './history.processor'

import { UsersModule } from '@modules/users'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: HISTORY_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    forwardRef(() => UsersModule),
    SpotifyModule,
    HistoryTracksModule,
  ],
  providers: [HistoryScheduler, HistoryProcessor],
  exports: [HistoryScheduler, BullModule],
})
export class HistoryModule {}
