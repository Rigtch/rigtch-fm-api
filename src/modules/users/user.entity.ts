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
  @ApiProperty({ type: String })
  id: string

  @OneToOne('Profile', 'user', { cascade: true, eager: true })
  @JoinColumn()
  @ApiProperty({ type: Profile })
  profile: Relation<Profile>

  @Column()
  @Exclude()
  refreshToken: string
}
