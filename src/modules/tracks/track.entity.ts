import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import { Album } from '@modules/albums'
import { Artist } from '@modules/artists'

@Entity()
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

  @OneToMany('Album', 'track', {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @ApiProperty({ type: Album })
  album: Relation<Album>

  @ManyToMany('Artist', 'tracks', {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  @ApiProperty({ type: Artist, isArray: true })
  artists: Relation<Artist[]>
}
