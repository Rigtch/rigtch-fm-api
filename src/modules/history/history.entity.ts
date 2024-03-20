import { ApiProperty } from '@nestjs/swagger'
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import { HistoryTrack } from './tracks'

import { User } from '@modules/users'

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @OneToOne('User', 'history', { eager: true })
  @JoinColumn()
  @ApiProperty()
  user: Relation<User>

  @OneToMany('HistoryTrack', 'history', {
    eager: true,
    cascade: true,
  })
  @ApiProperty()
  historyTracks: Relation<HistoryTrack[]>
}
