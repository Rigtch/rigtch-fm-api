import { Episode } from '@spotify/web-api-ts-sdk'

import { Device, Track, SpotifyDevice, SpotifyTrack } from '.'

export enum RepeatedState {
  TRACK = 'track',
  CONTEXT = 'context',
  OFF = 'off',
}

export interface SpotifyPlaybackState {
  device?: SpotifyDevice
  repeat_state?: string
  shuffle_state?: boolean
  is_playing?: boolean
  item?: SpotifyTrack | Episode
}

export interface PlaybackState {
  device?: Device
  repeatState?: RepeatedState
  shuffleState?: boolean
  isPlaying?: boolean
  track?: Track
}
