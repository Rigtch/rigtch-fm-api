import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { Artist } from './artist.entity'
import { ArtistsRepository } from './artists.repository'
import { ArtistsController } from './artists.controller'
import { ArtistsService } from './artists.service'

import { SpotifyModule } from '@modules/spotify'
import { ImagesModule } from '@modules/images'

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), SpotifyModule, ImagesModule],
  providers: [ArtistsRepository, ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsRepository, ArtistsService],
})
export class ArtistsModule {}
