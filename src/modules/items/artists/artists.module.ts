import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { Artist } from './artist.entity'
import { ArtistsRepository } from './artists.repository'
import { ArtistsController } from './artists.controller'
import { ArtistsService } from './artists.service'

@Module({
  imports: [TypeOrmModule.forFeature([Artist])],
  providers: [ArtistsRepository, ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsRepository, ArtistsService],
})
export class ArtistsModule {}
