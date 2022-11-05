import { spotifyArtistMock, formattedArtistMock } from '../mocks'

import { formatArtists } from '.'

describe('format-artists', () => {
  it('should format artists', () => {
    expect(formatArtists([spotifyArtistMock])).toEqual([formattedArtistMock])
  })
})
