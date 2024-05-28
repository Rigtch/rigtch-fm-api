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

import { Album } from '@modules/items/albums'
import { Artist } from '@modules/items/artists'
import type { HistoryTrack } from '@modules/history/tracks'

@Entity()
@Unique('TRACK_UNIQUE', ['externalId', 'href'])
export class Track implements Item {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @Column('varchar')
  @ApiProperty({
    description: 'The Spotify ID for the track.',
    example: '11dFghVXANMlKmJXsNCbNl',
  })
  externalId: string

  @Column('varchar')
  @ApiProperty({
    example: 'The Well of all Human Tears',
    description: 'The name of the track.',
  })
  name: string

  @Column('varchar')
  @ApiProperty({
    example: 'https://open.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl',
    description: 'The Spotify URL for the object.',
  })
  href: string

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 207_959,
    description: 'The track length in milliseconds.',
  })
  duration: number

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 7,
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

  @ManyToOne('Album', 'tracks', {
    nullable: true,
  })
  @ApiProperty({
    type: Album,
    description:
      'The album on which the track appears. The album object includes an externalId to get full information about the album.',
  })
  album?: Relation<Album>

  @OneToMany('HistoryTrack', 'track', {
    nullable: true,
    cascade: true,
  })
  historyTracks?: Relation<HistoryTrack[]>

  @ManyToMany('Artist', 'albums')
  @JoinTable()
  @ApiProperty({
    type: Artist,
    isArray: true,
    description:
      'The artists who performed the track. Each artist object includes an externalId to get more detailed information about the artist.',
  })
  artists: Relation<Artist[]>
}
