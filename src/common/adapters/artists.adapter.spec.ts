import {
  spotifyArtistMock,
  formattedArtistMock,
  spotifyArtistsMock,
  formattedArtistsMock,
} from '../mocks'

import { adaptArtist, adaptArtists } from './artists.adapter'

describe('adaptArtists', () => {
  it('should adapt artist', () => {
    expect(adaptArtist(spotifyArtistMock)).toEqual(formattedArtistMock)
  })

  it('should adapt artists', () => {
    expect(adaptArtists(spotifyArtistsMock)).toEqual(formattedArtistsMock)
  })
})
