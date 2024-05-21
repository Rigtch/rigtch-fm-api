import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm'

import { Item } from '../types'

import type { Image } from '@modules/items/images'

@Entity()
@Unique('ARTIST_UNIQUE', ['externalId', 'href'])
export class Artist implements Item {
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

  @Column('simple-array')
  @ApiProperty({ type: [String] })
  genres: string[]

  @Column('int')
  @ApiProperty({ type: Number })
  popularity: number

  @Column('int')
  @ApiProperty({ type: Number })
  followers: number

  @ManyToMany('Image', 'artists', {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinTable()
  @ApiProperty()
  images?: Relation<Image>[]
}
