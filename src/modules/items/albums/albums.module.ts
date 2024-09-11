import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Album } from './album.entity'
import { AlbumsController } from './albums.controller'
import { AlbumsRepository } from './albums.repository'
import { AlbumsService } from './albums.service'
import { AlbumSubscriber } from './album.subscriber'

import { ImagesModule } from '@modules/items/images'
import { ArtistsModule } from '@modules/items/artists'
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
  providers: [AlbumsRepository, AlbumsService, AlbumSubscriber],
  controllers: [AlbumsController],
  exports: [AlbumsRepository, AlbumsService],
})
export class AlbumsModule {}
