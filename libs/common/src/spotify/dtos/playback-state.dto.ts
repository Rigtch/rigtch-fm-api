import { Field, ObjectType } from '@nestjs/graphql'

import { Device, Track } from '.'

import {
  FormattedPlaybackState,
  RepeatedState,
  ShuffleState,
} from '@lib/common'

@ObjectType()
export abstract class PlaybackState implements FormattedPlaybackState {
  @Field(() => Device)
  device: Device

  @Field(() => String)
  repeatState: RepeatedState

  @Field(() => String)
  shuffleState: ShuffleState

  @Field(() => Boolean)
  isPlaying: boolean

  @Field(() => Track)
  track: Track
}
