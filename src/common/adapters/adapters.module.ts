import { Module } from '@nestjs/common'

import { ArtistsAdapter } from './artists.adapter'
import { AudioFeaturesAdapter } from './audio-features.adapter'
import { DevicesAdapter } from './devices.adapter'
import { GenresAdapter } from './genres.adapter'
import { PaginatedAdapter } from './paginated.adapter'
import { TracksAdapter } from './tracks.adapter'
import { PlaybackStateAdapter } from './playback-state.adapter'
import { ProfileAdapter } from './profile.adapter'
import { SecretDataAdapter } from './secret-data.adapter'
import { AdaptersService } from './adapters.service'

@Module({
  imports: [AdaptersService],
  providers: [
    ArtistsAdapter,
    TracksAdapter,
    AudioFeaturesAdapter,
    DevicesAdapter,
    GenresAdapter,
    PaginatedAdapter,
    PlaybackStateAdapter,
    ProfileAdapter,
    SecretDataAdapter,
  ],
  exports: [AdaptersService],
})
export class AdaptersModule {}
