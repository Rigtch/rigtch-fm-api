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

@Entity()
export class Artist {
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
  @ApiProperty({ type: Image, isArray: true })
  images?: Relation<Image>[]
}
