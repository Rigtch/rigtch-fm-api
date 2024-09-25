import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { Profile } from '@modules/profiles'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '2a348ca4-7a80-4f0f-b42a-c6c62a1145c6',
  })
  id: string

  @OneToOne('Profile', 'user', { cascade: true, eager: true })
  @JoinColumn()
  @ApiProperty({ type: Profile, description: "User's spotify profile" })
  profile: Relation<Profile>

  @Column()
  @Exclude()
  refreshToken: string

  @CreateDateColumn({
    type: 'timestamptz',
  })
  @ApiProperty({
    type: Date,
    example: '2024-05-28T07:08:59.724Z',
    description: 'The date and time the user was created.',
  })
  createdAt: Date

  @ManyToMany('User', 'following')
  @JoinTable()
  @ApiProperty({
    description: "The user's followers.",
  })
  followers: Relation<User[]>

  @ManyToMany('User', 'followers')
  @ApiProperty({
    description: "The user's following.",
  })
  following: Relation<User[]>

  @Column({ default: 0 })
  @ApiProperty({
    description: "Count of the user's followers.",
    default: 0,
  })
  followersCount: number

  @Column({ default: 0 })
  @ApiProperty({
    description: 'Count of the users that the user is following.',
    default: 0,
  })
  followingCount: number
}
