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
import { Exclude } from 'class-transformer'

import { Item } from '../types'
import { ItemType } from '../enums'

import type { Album } from '@modules/items/albums'
import type { Artist } from '@modules/items/artists'
import type { HistoryTrack } from '@modules/history/tracks'

@Entity()
@Unique('TRACK_UNIQUE', ['externalId', 'href'])
export class Track implements Item {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '71c6c7fe-cb38-43ac-916b-81e85115f520',
  })
  id: string

  @Column('varchar')
  @ApiProperty({
    description: 'The Spotify ID for the track.',
    example: '7gPherwdZt8Pdh8Srhw5HR',
  })
  externalId: string

  @Column('varchar')
  @ApiProperty({
    example: 'Lunar Nights',
    description: 'The name of the track.',
  })
  name: string

  @Column('varchar')
  @ApiProperty({
    example: 'https://open.spotify.com/track/7gPherwdZt8Pdh8Srhw5HR',
    description: 'The Spotify URL for the object.',
  })
  href: string

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 394_373,
    description: 'The track length in milliseconds.',
  })
  duration: number

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 8,
    description:
      'The number of the track. If an album has several discs, the track number is the number on the specified disc.',
  })
  trackNumber: number

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 1,
    description:
      'The disc number (usually 1 unless the album consists of more than one disc).',
  })
  discNumber: number

  @Column('boolean', {
    nullable: true,
  })
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether or not the track has explicit lyrics.',
  })
  explicit: boolean

  @Column('enum', {
    enum: ItemType,
    default: ItemType.TRACK,
  })
  @Exclude()
  type: ItemType

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
