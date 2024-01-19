import { PlaybackState as SpotifyPlaybackState } from '@spotify/web-api-ts-sdk'

import { PlaybackState, RepeatedState } from '../types/spotify'

import { deviceMock, trackMock, spotifyDeviceMock, spotifyTrackMock } from '.'

export const spotifyPlaybackStateMock: SpotifyPlaybackState = {
  device: spotifyDeviceMock,
  repeat_state: RepeatedState.OFF,
  shuffle_state: false,
  is_playing: true,
  item: spotifyTrackMock,
  context: null,
  timestamp: 0,
  progress_ms: 0,
  currently_playing_type: 'track',
  actions: {},
}

export const playbackStateMock: PlaybackState = {
  device: deviceMock,
  repeatState: spotifyPlaybackStateMock.repeat_state as RepeatedState,
  shuffleState: spotifyPlaybackStateMock.shuffle_state,
  isPlaying: spotifyPlaybackStateMock.is_playing,
  track: trackMock,
}
