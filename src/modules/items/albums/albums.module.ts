import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Album } from './album.entity'
import { AlbumsController } from './albums.controller'
import { AlbumsRepository } from './albums.repository'
import { AlbumsService } from './albums.service'

import { ArtistsModule } from '@modules/items/artists'
import { ImagesModule } from '@modules/items/images'
import { TracksModule } from '@modules/items/tracks'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    TracksModule,
    SpotifyModule,
    ArtistsModule,
    ImagesModule,
  ],
  providers: [AlbumsRepository, AlbumsService],
  controllers: [AlbumsController],
  exports: [AlbumsRepository, AlbumsService],
})
export class AlbumsModule {}
