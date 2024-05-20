import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import type { History } from '../history.entity'

import type { Track } from '@modules/items/tracks'
import type { User } from '@modules/users'

@Entity()
export class HistoryTrack {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @Column('timestamptz')
  @ApiProperty({ type: Date })
  playedAt: Date

  @ManyToOne('Track', 'historyTracks', {
    eager: true,
  })
  @ApiProperty()
  track: Relation<Track>

  @ManyToOne('User', 'historyTracks')
  user: Relation<User>

  @ManyToOne('History', 'historyTracks')
  history: Relation<History>
}
