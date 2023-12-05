import {
  PlaybackState,
  RepeatedState,
  ShuffleState,
  SpotifyPlaybackState,
} from '../types/spotify'

import { deviceMock, trackMock, spotifyDeviceMock, spotifyTrackMock } from '.'

export const spotifyPlaybackStateMock: SpotifyPlaybackState = {
  device: spotifyDeviceMock,
  repeat_state: RepeatedState.OFF,
  shuffle_state: ShuffleState.OFF,
  is_playing: true,
  item: spotifyTrackMock,
}

export const playbackStateMock: PlaybackState = {
  device: deviceMock,
  repeatState: spotifyPlaybackStateMock.repeat_state,
  shuffleState: spotifyPlaybackStateMock.shuffle_state,
  isPlaying: spotifyPlaybackStateMock.is_playing,
  track: trackMock,
}
