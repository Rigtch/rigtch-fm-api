import { spotifyTrackMock, formattedTrackMock } from '../mocks'

import { formatTracks } from '.'

describe('format-tracks', () => {
  it('should format tracks', () => {
    expect(formatTracks([spotifyTrackMock])).toEqual([formattedTrackMock])
  })
})
