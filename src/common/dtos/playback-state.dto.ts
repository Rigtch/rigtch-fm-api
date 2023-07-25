import { ApiProperty } from '@nestjs/swagger'

import { Device, Track } from '.'

import {
  FormattedPlaybackState,
  RepeatedState,
  ShuffleState,
} from '~/common/types/spotify'

export abstract class PlaybackState implements FormattedPlaybackState {
  @ApiProperty({ type: Device })
  device: Device

  @ApiProperty({ type: String })
  repeatState: RepeatedState

  @ApiProperty({ type: String })
  shuffleState: ShuffleState

  @ApiProperty({ type: Boolean })
  isPlaying: boolean

  @ApiProperty({ type: Track })
  track: Track
}
