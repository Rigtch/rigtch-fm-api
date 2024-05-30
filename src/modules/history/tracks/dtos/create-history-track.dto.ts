import { Transform } from 'class-transformer'
import { IsDate } from 'class-validator'

import type { Track } from '@modules/items/tracks'
import type { User } from '@modules/users'

export abstract class CreateHistoryTrack {
  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  readonly playedAt: Date

  readonly track: Track

  readonly user: User
}
