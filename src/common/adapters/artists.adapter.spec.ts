import { describe, test, expect } from 'vitest'

import {
  spotifyArtistMock,
  formattedArtistMock,
  spotifyArtistsMock,
  formattedArtistsMock,
} from '../mocks'

import { adaptArtist, adaptArtists } from './artists.adapter'

describe('adaptArtists', () => {
  test('should adapt artist', () => {
    expect(adaptArtist(spotifyArtistMock)).toEqual(formattedArtistMock)
  })

  test('should adapt artists', () => {
    expect(adaptArtists(spotifyArtistsMock)).toEqual(formattedArtistsMock)
  })
})
