import {
  Column,
  Entity,
  JoinColumn,
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
}
