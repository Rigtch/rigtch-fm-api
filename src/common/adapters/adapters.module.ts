import { Global, Module } from '@nestjs/common'

import { ArtistsAdapter } from './artists.adapter'
import { AudioFeaturesAdapter } from './audio-features.adapter'
import { DevicesAdapter } from './devices.adapter'
import { GenresAdapter } from './genres.adapter'
import { PageAdapter } from './page.adapter'
import { TracksAdapter } from './tracks.adapter'
import { PlaybackStateAdapter } from './playback-state.adapter'
import { ProfileAdapter } from './profile.adapter'
import { AdaptersService } from './adapters.service'
import { AlbumsAdapter } from './albums.adapter'

@Global()
@Module({
  providers: [
    ArtistsAdapter,
    TracksAdapter,
    AudioFeaturesAdapter,
    DevicesAdapter,
    GenresAdapter,
    PageAdapter,
    PlaybackStateAdapter,
    ProfileAdapter,
    AlbumsAdapter,
    AdaptersService,
  ],
  exports: [AdaptersService],
})
export class AdaptersModule {}
