import { Injectable } from '@nestjs/common'

import { DevicesAdapter } from './devices.adapter'
import { TracksAdapter } from './tracks.adapter'

import {
  PlaybackState,
  RepeatedState,
  SdkPlaybackState,
} from '@common/types/spotify'

@Injectable()
export class PlaybackStateAdapter {
  constructor(
    private readonly devicesAdapter: DevicesAdapter,
    private readonly tracksAdapter: TracksAdapter
  ) {}

  adapt(playbackState: SdkPlaybackState | null): PlaybackState | null {
    if (!playbackState) return playbackState

    const { device, repeat_state, shuffle_state, is_playing, item } =
      playbackState

    return {
      device: this.devicesAdapter.adapt(device),
      repeatState: repeat_state as RepeatedState,
      shuffleState: shuffle_state,
      isPlaying: is_playing,
      track: 'is_local' in item ? this.tracksAdapter.adapt(item) : undefined,
    }
  }
}
