import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { ImagesModule } from '../images'

import { Artist } from './artist.entity'
import { ArtistsRepository } from './artists.repository'
import { ArtistsService } from './artists.service'

import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), SpotifyModule, ImagesModule],
  providers: [ArtistsRepository, ArtistsService],
  exports: [ArtistsRepository, ArtistsService],
})
export class ArtistsModule {}
