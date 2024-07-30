import { Module, forwardRef } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'

import { HistoryScheduler } from './history.scheduler'
import { HistoryTracksModule } from './tracks'
import { HISTORY_QUEUE } from './constants'
import { HistoryProcessor } from './history.processor'
import { HistoryQueueEvents } from './history.queue-events'

import { UsersModule } from '@modules/users'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [
    BullModule.registerQueue({
      name: HISTORY_QUEUE,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 200,
      },
    }),
    BullBoardModule.forFeature({
      name: HISTORY_QUEUE,
      adapter: BullMQAdapter,
    }),
    forwardRef(() => UsersModule),
    SpotifyModule,
    HistoryTracksModule,
  ],
  providers: [HistoryScheduler, HistoryProcessor, HistoryQueueEvents],
  exports: [HistoryScheduler, BullModule, HistoryProcessor, HistoryQueueEvents],
})
export class HistoryModule {}
