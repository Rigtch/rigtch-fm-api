import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import type { Track } from '@modules/items/tracks'
import type { User } from '@modules/users'
import { TrackDocument } from '@modules/items/tracks/docs'

@Entity()
export class HistoryTrack {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @Column('timestamptz')
  @ApiProperty({
    type: Date,
    example: '2024-05-28T07:08:59.724Z',
    description: 'The date and time the track was played.',
  })
  playedAt: Date

  @ManyToOne('Track', 'historyTracks', {
    eager: true,
  })
  @ApiProperty({
    type: TrackDocument,
    description: 'The track that was played.',
  })
  track: Relation<Track>

  @ManyToOne('User', 'historyTracks')
  user: Relation<User>
}
