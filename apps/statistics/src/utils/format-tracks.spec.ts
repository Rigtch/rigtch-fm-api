import { spotifyTrackMock, formattedTrackMock } from '../mocks'

import { formatTracks } from '.'

describe('formatTracks', () => {
  it('should format tracks', () => {
    expect(formatTracks([spotifyTrackMock])).toEqual([formattedTrackMock])
  })
})
