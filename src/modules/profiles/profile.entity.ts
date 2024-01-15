import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { Image } from '@modules/images'

@Entity()
export class Profile {
  @PrimaryColumn()
  @ApiProperty()
  id: string

  @Column()
  @ApiProperty()
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
  @ApiProperty({ type: Number })
  followers: number

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  country?: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  email?: string

  @Column()
  @ApiProperty()
  href: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  product?: string

  @Column()
  @ApiProperty()
  type: string

  @Column()
  @ApiProperty()
  uri: string
}
