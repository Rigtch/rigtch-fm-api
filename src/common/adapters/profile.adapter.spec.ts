import { test, describe, expect } from 'vitest'

import { spotifyProfileMock, formattedProfileMock } from '../mocks'

import { adaptProfile } from './profile.adapter'

describe('adaptProfile', () => {
  test('should adapt profile', () => {
    expect(adaptProfile(spotifyProfileMock)).toEqual(formattedProfileMock)
  })
})
