import {
  PlaybackState,
  RepeatedState,
  SpotifyPlaybackState,
} from '../types/spotify'

import { adaptDevices } from './devices.adapter'
import { adaptTrack } from './tracks.adapter'

export const adaptPlaybackState = (
  playbackState: SpotifyPlaybackState | null
): PlaybackState | null => {
  if (!playbackState) return playbackState

  const { device, repeat_state, shuffle_state, is_playing, item } =
    playbackState

  return {
    device: device ? adaptDevices([device])[0] : undefined,
    repeatState: repeat_state as RepeatedState,
    shuffleState: shuffle_state,
    isPlaying: is_playing,
    track: item && 'is_local' in item ? adaptTrack(item) : undefined,
  }
}
