import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

import { Device, Track } from '.'

import {
  FormattedPlaybackState,
  RepeatedState,
  ShuffleState,
} from '~/common/types/spotify'

@ObjectType()
export abstract class PlaybackState implements FormattedPlaybackState {
  @Field(() => Device)
  @ApiProperty({ type: Device })
  device: Device

  @Field(() => String)
  @ApiProperty({ type: String })
  repeatState: RepeatedState

  @Field(() => String)
  @ApiProperty({ type: String })
  shuffleState: ShuffleState

  @Field(() => Boolean)
  @ApiProperty({ type: Boolean })
  isPlaying: boolean

  @Field(() => Track)
  @ApiProperty({ type: Track })
  track: Track
}
