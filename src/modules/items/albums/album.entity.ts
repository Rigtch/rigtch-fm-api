import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm'

import { Item } from '../types'

import type { Image } from '@modules/images'
import type { Artist } from '@modules/items/artists'
import type { Track } from '@modules/items/tracks'

@Entity()
@Unique('ALBUM_UNIQUE', ['externalId', 'href'])
export class Album implements Item {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @Column('varchar')
  @ApiProperty()
  externalId: string

  @Column('varchar')
  @ApiProperty()
  name: string

  @Column('timestamptz')
  @ApiProperty({ type: Date })
  releaseDate: Date

  @Column('varchar')
  @ApiProperty()
  albumType: string

  @Column('int')
  @ApiProperty({ type: Number })
  totalTracks: number

  @Column('varchar')
  @ApiProperty()
  href: string

  @ManyToMany('Image', 'albums', {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinTable()
  images?: Relation<Image[]>

  @OneToMany('Track', 'album', {
    nullable: true,
    cascade: true,
  })
  tracks?: Relation<Track[]>

  @ManyToMany('Artist', 'albums', {
    cascade: true,
  })
  @JoinTable()
  artists: Relation<Artist[]>
}
