import {
  Column,
  Entity,
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
  @ApiProperty()
  id: string

  @OneToOne('Profile', 'user', {
    cascade: true,
  })
  @ApiProperty({ type: Profile })
  profile: Relation<Profile>

  @Column()
  @Exclude()
  refreshToken: string
}
