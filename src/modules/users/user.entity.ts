import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { Profile } from '../profiles'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @OneToOne('Profile', 'user')
  @ApiProperty({ type: Profile })
  profile: Relation<Profile>

  @Column()
  @Exclude()
  refreshToken: string
}
