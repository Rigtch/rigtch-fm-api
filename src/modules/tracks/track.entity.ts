import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import type { Album } from '@modules/albums'
import type { Artist } from '@modules/artists'

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

  @ManyToOne('Album', 'tracks', {
    nullable: true,
  })
  album?: Relation<Album>

  @ManyToMany('Artist', 'albums', {
    cascade: true,
  })
  @JoinTable()
  artists: Relation<Artist[]>
}
