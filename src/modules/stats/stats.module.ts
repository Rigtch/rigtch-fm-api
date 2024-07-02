import { Module } from '@nestjs/common'

import { StatsRigtchService } from './stats-rigtch.service'

import { HistoryTracksModule } from '@modules/history/tracks'

@Module({
  imports: [HistoryTracksModule],
  providers: [StatsRigtchService],
  exports: [StatsRigtchService],
})
export class StatsModule {}
