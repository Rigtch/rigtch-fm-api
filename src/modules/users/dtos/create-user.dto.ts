import { ApiProperty } from '@nestjs/swagger'

import { User } from '../user.entity'

import { Profile } from '@modules/profiles'

export abstract class CreateUser implements Omit<User, 'id'> {
  @ApiProperty()
  profile: Profile

  @ApiProperty()
  refreshToken: string
}
