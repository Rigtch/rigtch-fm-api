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
import { Exclude } from 'class-transformer'

import { Item } from '../types'
import { ItemType } from '../enums'

import { ReleaseDatePrecision } from './enums'

import { Image } from '@modules/items/images'
import type { Artist } from '@modules/items/artists'
import type { Track } from '@modules/items/tracks'

@Entity()
@Unique('ALBUM_UNIQUE', ['externalId', 'href'])
export class Album implements Item {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '4530c625-2385-45d6-8db1-8b867f125e30',
  })
  id: string

  @Column('varchar')
  @ApiProperty({
    description: 'The Spotify ID of the album.',
    example: '50MDwzTscb7tQjSGLtDXFj',
  })
  externalId: string

  @Column('varchar')
  @ApiProperty({
    example: 'Black Shining Leather',
    description:
      'The name of the album. In case of an album takedown, the value may be an empty string.',
  })
  name: string

  @Column('timestamptz')
  @ApiProperty({
    type: Date,
    example: '1998-01-01T00:00:00.000Z',
    description:
      'The date the album was first released. Value can be known in three precision levels: year, month, day.',
  })
  releaseDate: Date

  @Column('enum', {
    enum: ReleaseDatePrecision,
    nullable: true,
    default: ReleaseDatePrecision.DAY,
  })
  @ApiProperty({
    enum: Object.entries(ReleaseDatePrecision),
    example: ReleaseDatePrecision.DAY,
    description: 'The precision with which releaseDate is known.',
  })
  releaseDatePrecision?: ReleaseDatePrecision

  @Column('varchar')
  @ApiProperty({
    enum: ['album', 'single', 'compilation'],
    example: 'album',
    description: 'The type of the album.',
  })
  albumType: string

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 11,
    description: 'The number of tracks in the album.',
  })
  totalTracks: number

  @Column('varchar')
  @ApiProperty({
    example: 'https://open.spotify.com/v1/album/50MDwzTscb7tQjSGLtDXFj',
    description: 'The Spotify URL for the object.',
  })
  href: string

  @Column('enum', {
    enum: ItemType,
    default: ItemType.ALBUM,
  })
  @Exclude()
  type: ItemType

  @ManyToMany('Image', 'albums', {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinTable()
  @ApiProperty({
    type: Image,
    isArray: true,
    description: 'The cover art for the album in various sizes, widest first.',
  })
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
