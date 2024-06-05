import { Injectable } from '@nestjs/common'

import { AudioFeaturesAdapter } from './audio-features.adapter'
import { DevicesAdapter } from './devices.adapter'
import { GenresAdapter } from './genres.adapter'
import { PageAdapter } from './page.adapter'
import { TracksAdapter } from './tracks.adapter'
import { PlaybackStateAdapter } from './playback-state.adapter'
import { ProfileAdapter } from './profile.adapter'
import { ArtistsAdapter } from './artists.adapter'
import { AlbumsAdapter } from './albums.adapter'

@Injectable()
export class AdaptersService {
  constructor(
    readonly artists: ArtistsAdapter,
    readonly tracks: TracksAdapter,
    readonly audioFeatures: AudioFeaturesAdapter,
    readonly devices: DevicesAdapter,
    readonly genres: GenresAdapter,
    readonly page: PageAdapter,
    readonly playbackState: PlaybackStateAdapter,
    readonly profile: ProfileAdapter,
    readonly albums: AlbumsAdapter
  ) {}
}
