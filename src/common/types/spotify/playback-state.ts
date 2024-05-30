import { Device } from './device'
import { Track } from './track'

export enum RepeatedState {
  TRACK = 'track',
  CONTEXT = 'context',
  OFF = 'off',
}

export interface PlaybackState {
  device?: Device
  repeatState?: RepeatedState
  shuffleState?: boolean
  isPlaying?: boolean
  track?: Track
}

export { PlaybackState as SdkPlaybackState } from '@spotify/web-api-ts-sdk'
