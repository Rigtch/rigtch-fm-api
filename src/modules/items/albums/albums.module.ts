import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Album } from './album.entity'
import { AlbumsRepository } from './albums.repository'
import { AlbumsController } from './albums.controller'
import { AlbumsService } from './albums.service'

import { SpotifyModule } from '@modules/spotify'
import { ImagesModule } from '@modules/items/images'
import { ArtistsModule } from '@modules/items/artists'
import { TracksModule } from '@modules/items/tracks'

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistsModule),
    SpotifyModule,
    ImagesModule,
  ],
  providers: [AlbumsRepository, AlbumsService],
  controllers: [AlbumsController],
  exports: [AlbumsRepository, AlbumsService],
})
export class AlbumsModule {}
