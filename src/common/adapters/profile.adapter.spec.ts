import { Test } from '@nestjs/testing'

import { ProfileAdapter } from './profile.adapter'

import { profileMock, spotifyProfileMock } from '@common/mocks'

describe('ProfileAdapter', () => {
  let profileAdapter: ProfileAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProfileAdapter],
    }).compile()

    profileAdapter = module.get(ProfileAdapter)
  })

  test('should be defined', () => {
    expect(profileAdapter).toBeDefined()
  })

  test('should adapt a user profile', () => {
    expect(profileAdapter.adapt(spotifyProfileMock)).toEqual(profileMock)
  })
})
