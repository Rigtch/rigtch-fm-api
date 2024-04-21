import { Test, TestingModule } from '@nestjs/testing'

import { ProfileAdapter } from './profile.adapter'

import { profileMock, sdkProfileMock } from '@common/mocks'

describe('ProfileAdapter', () => {
  let moduleRef: TestingModule
  let profileAdapter: ProfileAdapter

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [ProfileAdapter],
    }).compile()

    profileAdapter = moduleRef.get(ProfileAdapter)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(profileAdapter).toBeDefined()
  })

  test('should adapt a user profile', () => {
    expect(profileAdapter.adapt(sdkProfileMock)).toEqual(profileMock)
  })
})
