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

import type { Album } from '@modules/albums'
import type { Artist } from '@modules/artists'
import type { HistoryTrack } from '@modules/history/tracks'

@Entity()
@Unique('TRACK_UNIQUE', ['externalId', 'href'])
export class Track {
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
