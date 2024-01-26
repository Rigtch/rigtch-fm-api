import { PlaybackState as SpotifyPlaybackState } from '@spotify/web-api-ts-sdk'

import { PlaybackState, RepeatedState } from '../types/spotify'

import { deviceMock, trackMock, sdkDeviceMock, sdkTrackMock } from '.'

export const sdkPlaybackStateMock: SpotifyPlaybackState = {
  device: sdkDeviceMock,
  repeat_state: RepeatedState.OFF,
  shuffle_state: false,
  is_playing: true,
  item: sdkTrackMock,
  context: null,
  timestamp: 0,
  progress_ms: 0,
  currently_playing_type: 'track',
  actions: {},
}

export const playbackStateMock: PlaybackState = {
  device: deviceMock,
  repeatState: sdkPlaybackStateMock.repeat_state as RepeatedState,
  shuffleState: sdkPlaybackStateMock.shuffle_state,
  isPlaying: sdkPlaybackStateMock.is_playing,
  track: trackMock,
}
