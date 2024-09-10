import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Track } from './track.entity'
import { TracksController } from './tracks.controller'
import { TracksRepository } from './tracks.repository'
import { TracksService } from './tracks.service'

import { ArtistsModule } from '@modules/items/artists'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [TypeOrmModule.forFeature([Track]), SpotifyModule, ArtistsModule],
  controllers: [TracksController],
  providers: [TracksRepository, TracksService],
  exports: [TracksRepository, TracksService],
})
export class TracksModule {}
