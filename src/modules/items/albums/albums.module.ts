import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Album } from './album.entity'
import { AlbumsRepository } from './albums.repository'
import { AlbumsController } from './albums.controller'
import { AlbumsService } from './albums.service'
import { AlbumsValidator } from './albums.validator'

import { TracksModule } from '@modules/items/tracks'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => TracksModule),
    SpotifyModule,
  ],
  providers: [AlbumsRepository, AlbumsService, AlbumsValidator],
  controllers: [AlbumsController],
  exports: [AlbumsRepository, AlbumsService],
})
export class AlbumsModule {}
