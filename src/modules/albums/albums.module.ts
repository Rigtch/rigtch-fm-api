import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Album } from './album.entity'
import { AlbumsRepository } from './albums.repository'

import { SpotifyModule } from '@modules/spotify'
import { ImagesModule } from '@modules/images'
import { ArtistsModule } from '@modules/artists'

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    SpotifyModule,
    ImagesModule,
    ArtistsModule,
  ],
  providers: [AlbumsRepository],
  exports: [AlbumsRepository],
})
export class AlbumsModule {}
