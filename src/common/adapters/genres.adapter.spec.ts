import { spotifyArtistsMock, topGenresMock } from '../mocks'

import { adaptGenres } from './genres.adapter'

describe('adaptGenres', () => {
  it('should adapt genres', () => {
    expect(adaptGenres(spotifyArtistsMock, 3)).toEqual(topGenresMock)
  })
})
