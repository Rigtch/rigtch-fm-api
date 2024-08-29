import { Module } from '@nestjs/common'

import { ReportsService } from './reports.service'

import { HistoryTracksModule } from '@modules/history/tracks'

@Module({
  imports: [HistoryTracksModule],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
