import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Album } from './album.entity'
import { AlbumsRepository } from './albums.repository'
import { AlbumsController } from './albums.controller'

import { SpotifyModule } from '@modules/spotify'
import { ImagesModule } from '@modules/images'
import { ArtistsModule } from '@modules/artists'
import { TracksModule } from '@modules/tracks'

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    SpotifyModule,
    ImagesModule,
    ArtistsModule,
    TracksModule,
  ],
  providers: [AlbumsRepository],
  controllers: [AlbumsController],
  exports: [AlbumsRepository],
})
export class AlbumsModule {}
