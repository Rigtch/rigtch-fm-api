import { User } from '../user.entity'

import { Profile } from '@modules/profiles'

export abstract class CreateUser implements Omit<User, 'id' | 'createdAt'> {
  readonly profile: Profile
  readonly refreshToken: string
}
