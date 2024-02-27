import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Track } from './track.entity'
import { TracksRepository } from './tracks.repository'
import { TracksController } from './tracks.controller'

import { SpotifyModule } from '@modules/spotify'
import { AlbumsModule } from '@modules/albums'
import { ArtistsModule } from '@modules/artists'

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    SpotifyModule,
    forwardRef(() => AlbumsModule),
    forwardRef(() => ArtistsModule),
  ],
  controllers: [TracksController],
  providers: [TracksRepository],
  exports: [TracksRepository],
})
export class TracksModule {}
