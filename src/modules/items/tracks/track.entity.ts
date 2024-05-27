import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm'

import { Item } from '../types'

import type { Album } from '@modules/items/albums'
import type { Artist } from '@modules/items/artists'
import type { HistoryTrack } from '@modules/history/tracks'

@Entity()
@Unique('TRACK_UNIQUE', ['externalId', 'href'])
export class Track implements Item {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @Column('varchar')
  @ApiProperty()
  externalId: string

  @Column('varchar')
  @ApiProperty()
  name: string

  @Column('varchar')
  @ApiProperty()
  href: string

  @Column('int')
  @ApiProperty({ type: Number })
  duration: number

  @Column('int')
  @ApiProperty({ type: Number })
  trackNumber: number

  @Column('int')
  @ApiProperty({ type: Number })
  discNumber: number

  @ManyToOne('Album', 'tracks', {
    nullable: true,
  })
  album?: Relation<Album>

  @OneToMany('HistoryTrack', 'track', {
    nullable: true,
    cascade: true,
  })
  historyTracks?: Relation<HistoryTrack[]>

  @ManyToMany('Artist', 'albums')
  @JoinTable()
  artists: Relation<Artist[]>
}
