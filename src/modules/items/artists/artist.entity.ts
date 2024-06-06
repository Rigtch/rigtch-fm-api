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
import { Exclude } from 'class-transformer'

import { Item } from '../types'
import { ItemType } from '../enums'

import { Image } from '@modules/items/images'

@Entity()
@Unique('ARTIST_UNIQUE', ['externalId', 'href'])
export class Artist implements Item {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '293456e8-64f4-49f0-9811-6344bbf350a7',
  })
  id: string

  @Column('varchar')
  @ApiProperty({
    example: '0sFntmE9T1tiF6G6O6Lm3H',
    description: 'The Spotify ID of the album.',
  })
  externalId: string

  @Column('varchar')
  @ApiProperty({
    example: 'Carpathian Forest',
    description: 'The name of the artist.',
  })
  name: string

  @Column('varchar')
  @ApiProperty({
    example: 'https://open.spotify.com/v1/artist/0sFntmE9T1tiF6G6O6Lm3H',
    description: 'The Spotify URL for the object.',
  })
  href: string

  @Column('simple-array')
  @ApiProperty({
    type: [String],
    example: [
      'black metal',
      'norwegian black metal',
      'norwegian metal',
      'pagan black metal',
      'symphonic black metal',
    ],
    description:
      'A list of the genres the artist is associated with. If not yet classified, the array is empty.',
  })
  genres: string[]

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 34,
    description:
      "The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks.",
  })
  popularity: number

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 164_948,
    description: "The total number of artist's followers.",
  })
  followers: number

  @Column('enum', {
    enum: ItemType,
    default: ItemType.ARTIST,
    nullable: true,
  })
  @Exclude()
  type: ItemType

  @ManyToMany('Image', 'artists', {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinTable()
  @ApiProperty({
    type: [Image],
    description: 'Images of the artist in various sizes, widest first.',
  })
  images?: Relation<Image>[]
}
