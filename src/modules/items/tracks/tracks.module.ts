import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Track } from './track.entity'
import { TracksRepository } from './tracks.repository'
import { TracksController } from './tracks.controller'
import { TracksService } from './tracks.service'

import { SpotifyModule } from '@modules/spotify'
import { AlbumsModule } from '@modules/items/albums'

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    SpotifyModule,
    forwardRef(() => AlbumsModule),
  ],
  controllers: [TracksController],
  providers: [TracksRepository, TracksService],
  exports: [TracksRepository, TracksService],
})
export class TracksModule {}
