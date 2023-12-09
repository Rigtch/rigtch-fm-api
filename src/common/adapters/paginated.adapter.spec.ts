import {
  artistsMock,
  spotifyArtistsMock,
  spotifyResponseMockFactory,
} from '../mocks'

import { adaptArtists } from './artists.adapter'
import { adaptPaginated } from './paginated.adapter'

describe('adaptPaginated', () => {
  const spotifyArtistsResponseMock = {
    ...spotifyResponseMockFactory(spotifyArtistsMock),
    offset: 0,
  }

  const formattedArtistsResponseMock = {
    ...spotifyResponseMockFactory(artistsMock),
    offset: 0,
  }

  test('should adapt paginated data', () => {
    expect(adaptPaginated(spotifyArtistsResponseMock, adaptArtists)).toEqual(
      formattedArtistsResponseMock
    )
  })
})
