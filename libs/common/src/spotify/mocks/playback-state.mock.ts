import {
  FormattedPlaybackState,
  RepeatedState,
  ShuffleState,
  SpotifyPlaybackState,
} from '../types'

import {
  formattedDeviceMock,
  formattedTrackMock,
  spotifyDeviceMock,
  spotifyTrackMock,
} from '.'

export const spotifyPlaybackStateMock: SpotifyPlaybackState = {
  device: spotifyDeviceMock,
  repeat_state: RepeatedState.OFF,
  shuffle_state: ShuffleState.OFF,
  is_playing: true,
  item: spotifyTrackMock,
}

export const formattedPlaybackStateMock: FormattedPlaybackState = {
  device: formattedDeviceMock,
  repeatState: RepeatedState.OFF,
  shuffleState: ShuffleState.OFF,
  isPlaying: true,
  track: formattedTrackMock,
}
