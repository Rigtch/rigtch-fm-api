import { PlaybackState, SpotifyPlaybackState } from '../types/spotify'

import { adaptDevices } from './devices.adapter'
import { adaptTrack } from './tracks.adapter'

export const adaptPlaybackState = ({
  device,
  repeat_state,
  shuffle_state,
  is_playing,
  item,
}: SpotifyPlaybackState): PlaybackState => {
  return {
    device: device ? adaptDevices([device])[0] : undefined,
    repeatState: repeat_state,
    shuffleState: shuffle_state,
    isPlaying: is_playing,
    track: item ? adaptTrack(item) : undefined,
  }
}
