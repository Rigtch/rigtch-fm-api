import { test, describe, expect } from 'vitest'

import {
  spotifyTracksMock,
  formattedTracksMock,
  spotifyResponseWithCursorsMockFactory,
  spotifyResponseWithOffsetMockFactory,
} from '../mocks'

import {
  adaptLastTracks,
  adaptPaginatedTracks,
  adaptTracks,
} from './tracks.adapter'

describe('adaptTracks', () => {
  test('should adapt tracks', () => {
    expect(adaptTracks(spotifyTracksMock)).toEqual(formattedTracksMock)
  })

  test('should adapt tracks without duration', () => {
    expect(
      adaptTracks(spotifyTracksMock.map(({ progress_ms, ...rest }) => rest))
    ).toEqual(formattedTracksMock.map(({ progress, ...rest }) => rest))
  })

  test('should adapt tracks without playedAt field', () => {
    expect(
      adaptTracks(spotifyTracksMock.map(({ played_at, ...rest }) => rest))
    ).toEqual(formattedTracksMock.map(({ playedAt, ...rest }) => rest))
  })

  test('should adapt paginated tracks', () => {
    expect(
      adaptPaginatedTracks(
        spotifyResponseWithOffsetMockFactory(spotifyTracksMock)
      )
    ).toEqual(spotifyResponseWithOffsetMockFactory(formattedTracksMock))
  })

  test('should adapt last tracks', () => {
    expect(
      adaptLastTracks(spotifyResponseWithCursorsMockFactory(spotifyTracksMock))
    ).toEqual(spotifyResponseWithCursorsMockFactory(formattedTracksMock))
  })
})
