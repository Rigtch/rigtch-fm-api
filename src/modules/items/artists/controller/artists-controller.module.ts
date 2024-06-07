import { Module } from '@nestjs/common'

import { ArtistsModule } from '../artists.module'

import { ArtistsController } from './artists.controller'

import { ItemsModule } from '@modules/items'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [ArtistsModule, ItemsModule, SpotifyModule],
  controllers: [ArtistsController],
})
export class ArtistsControllerModule {}
