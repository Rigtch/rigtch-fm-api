import { spotifyProfileMock, formattedProfileMock } from '../mocks'

import { adaptProfile } from './profile.adapter'

describe('adaptProfile', () => {
  it('should adapt profile', () => {
    expect(adaptProfile(spotifyProfileMock)).toEqual(formattedProfileMock)
  })
})
