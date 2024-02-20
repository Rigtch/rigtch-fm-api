import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import { Image } from '@modules/images'
import { Artist } from '@modules/artists'

@Entity()
export class Album {
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
  @ApiProperty({ type: Image, isArray: true })
  images?: Relation<Image>[]

  @ManyToMany('Artist', 'albums', {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  @ApiProperty({ type: Artist, isArray: true })
  artists: Relation<Artist>[]
}
