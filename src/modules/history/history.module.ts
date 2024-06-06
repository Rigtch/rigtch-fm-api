import { Module, forwardRef } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { BullModule } from '@nestjs/bull'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullAdapter } from '@bull-board/api/bullAdapter'

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
        removeOnComplete: 50,
        removeOnFail: 200,
      },
    }),
    BullBoardModule.forFeature({
      name: HISTORY_QUEUE,
      adapter: BullAdapter,
    }),
    forwardRef(() => UsersModule),
    SpotifyModule,
    HistoryTracksModule,
  ],
  providers: [HistoryScheduler, HistoryProcessor],
  exports: [HistoryScheduler, BullModule],
})
export class HistoryModule {}
