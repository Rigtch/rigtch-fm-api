import { profileMock } from './profile.mock'

import { User } from '@modules/users'

export const userMock: User = {
  id: '1',
  refreshToken: 'refreshToken',
  profile: profileMock,
  createdAt: new Date(),
  followers: [],
  following: [],
  followersCount: 0,
  followingCount: 0,
}

export const usersMock = Array.from({ length: 3 }, () => userMock)
