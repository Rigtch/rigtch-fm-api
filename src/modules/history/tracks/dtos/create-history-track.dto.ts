import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDate, IsInstance } from 'class-validator'

import { Track } from '@modules/tracks'
import { User } from '@modules/users'

export abstract class CreateHistoryTrack {
  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  playedAt: Date

  @ApiProperty({ type: Track })
  @IsInstance(Track)
  track: Track

  @ApiProperty({ type: User })
  @IsInstance(User)
  user: User
}
