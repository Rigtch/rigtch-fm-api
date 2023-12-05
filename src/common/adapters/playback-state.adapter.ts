import { PlaybackState, SpotifyPlaybackState } from '../types/spotify'

import { adaptDevices } from './devices.adapter'
import { adaptTracks } from './tracks.adapter'

export const adaptPlaybackState = ({
  device,
  repeat_state,
  shuffle_state,
  is_playing,
  item,
}: SpotifyPlaybackState): PlaybackState => {
  const [formattedDevice] = adaptDevices([device])
  const [formattedTrack] = adaptTracks([item])

  return {
    device: formattedDevice,
    repeatState: repeat_state,
    shuffleState: shuffle_state,
    isPlaying: is_playing,
    track: formattedTrack,
  }
}
