import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { HistoryTrack } from './history-track.entity'
import { HistoryTracksRepository } from './history-tracks.repository'
import { HistoryTracksService } from './history-tracks.service'

import { TracksModule } from '@modules/tracks'

@Module({
  imports: [TypeOrmModule.forFeature([HistoryTrack]), TracksModule],
  providers: [HistoryTracksRepository, HistoryTracksService],
  exports: [HistoryTracksRepository, HistoryTracksService],
})
export class HistoryTracksModule {}
