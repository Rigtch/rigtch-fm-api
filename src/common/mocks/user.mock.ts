import { profileMock } from './profile.mock'

import { User } from '@modules/users'

export const userMock: User = {
  id: '1',
  refreshToken: 'refreshToken',
  profile: profileMock,
}

export const usersMock = Array.from({ length: 3 }, () => userMock)
