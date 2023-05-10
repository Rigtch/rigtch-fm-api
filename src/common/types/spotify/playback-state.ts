import { FormattedDevice, FormattedTrack, SpotifyDevice, SpotifyTrack } from '.'

export enum RepeatedState {
  TRACK = 'track',
  CONTEXT = 'context',
  OFF = 'off',
}

export enum ShuffleState {
  ON = 'on',
  OFF = 'off',
}

export interface SpotifyPlaybackState {
  device: SpotifyDevice
  repeat_state: RepeatedState
  shuffle_state: ShuffleState
  is_playing: boolean
  item: SpotifyTrack
}

export interface FormattedPlaybackState {
  device: FormattedDevice
  repeatState: RepeatedState
  shuffleState: ShuffleState
  isPlaying: boolean
  track: FormattedTrack
}
