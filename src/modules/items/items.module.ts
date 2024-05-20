import { Module } from '@nestjs/common'

import { ItemsService } from './items.service'
import { AlbumsModule } from './albums'
import { ArtistsModule } from './artists'
import { TracksModule } from './tracks'

import { ImagesModule } from '@modules/images'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [
    AlbumsModule,
    ArtistsModule,
    ImagesModule,
    TracksModule,
    SpotifyModule,
  ],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
