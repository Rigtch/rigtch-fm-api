import { spotifyProfileMock, profileMock } from '../mocks'

import { adaptProfile } from './profile.adapter'

describe('adaptProfile', () => {
  test('should adapt profile', () => {
    expect(adaptProfile(spotifyProfileMock)).toEqual(profileMock)
  })
})
