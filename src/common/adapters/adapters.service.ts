import { Injectable } from '@nestjs/common'

import { AudioFeaturesAdapter } from './audio-features.adapter'
import { DevicesAdapter } from './devices.adapter'
import { GenresAdapter } from './genres.adapter'
import { PaginatedAdapter } from './paginated.adapter'
import { TracksAdapter } from './tracks.adapter'
import { PlaybackStateAdapter } from './playback-state.adapter'

@Injectable()
export class AdaptersService {
  constructor(
    readonly artists: AdaptersService,
    readonly tracks: TracksAdapter,
    readonly audioFeatures: AudioFeaturesAdapter,
    readonly devices: DevicesAdapter,
    readonly genres: GenresAdapter,
    readonly paginated: PaginatedAdapter,
    readonly playbackState: PlaybackStateAdapter
  ) {}
}
