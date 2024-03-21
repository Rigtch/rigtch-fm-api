import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'

import { History } from './history.entity'
import { HistoryRepository } from './history.repository'
import { HistoryScheduler } from './history.scheduler'
import { HistoryTracksModule } from './tracks'

import { UsersModule } from '@modules/users'
import { SpotifyModule } from '@modules/spotify'
import { TracksModule } from '@modules/tracks'
import { AlbumsModule } from '@modules/albums'

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
    ScheduleModule.forRoot(),
    forwardRef(() => UsersModule),
    SpotifyModule,
    TracksModule,
    AlbumsModule,
    HistoryTracksModule,
  ],
  providers: [HistoryRepository, HistoryScheduler],
  exports: [HistoryRepository, HistoryScheduler],
})
export class HistoryModule {}
