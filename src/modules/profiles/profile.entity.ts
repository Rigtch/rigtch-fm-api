import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { Image } from '@modules/items/images'

@Entity()
export class Profile {
  @PrimaryColumn()
  @ApiProperty({
    description: 'The Spotify user id.',
    example: '31cnbi3skdx5hv5onslik572r4la',
  })
  id: string

  @Column()
  @ApiProperty({
    description: 'The Spotify user display name.',
    example: 'mng775',
  })
  displayName: string

  @ManyToMany('Image', 'profiles', {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinTable()
  @ApiProperty({ type: Image, isArray: true })
  images?: Relation<Image>[]

  @Column('int')
  @ApiProperty({
    description: 'The number of followers the Spotify user has.',
    type: Number,
    example: 0,
  })
  followers: number

  @Column({ nullable: true })
  @ApiProperty({
    description: 'The country of the Spotify user.',
    example: 'PL',
    nullable: true,
  })
  country?: string

  @Column({ nullable: true })
  @ApiProperty({
    description: 'The email of the Spotify user.',
    example: 'example.com',
    nullable: true,
  })
  email?: string

  @Column()
  @ApiProperty({
    description: "The link to the user's Spotify account.",
    example: 'https://open.spotify.com/user//31cnbi3skdx5hv5onslik572r4la',
  })
  href: string

  @Column({ nullable: true })
  @ApiProperty({
    description: `The user's Spotify subscription level: "premium", "free", etc. (The subscription level "open" can be considered the same as "free".)`,
    example: 'premium',
    nullable: true,
  })
  product?: string

  @Column()
  @ApiProperty({
    description: 'The object type: "user"',
    example: 'user',
    deprecated: true,
  })
  type: string

  @Column()
  @ApiProperty({
    description: 'The Spotify URI for the user.',
    example: 'spotify:user:31cnbi3skdx5hv5onslik572r4la',
    deprecated: true,
  })
  uri: string
}
