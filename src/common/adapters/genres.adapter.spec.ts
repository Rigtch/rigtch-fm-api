import { test, describe, expect } from 'vitest'

import { spotifyArtistsMock, topGenresMock } from '../mocks'

import { adaptGenres } from './genres.adapter'

describe('adaptGenres', () => {
  test('should adapt genres', () => {
    expect(adaptGenres(spotifyArtistsMock, 3)).toEqual(topGenresMock)
  })
})
