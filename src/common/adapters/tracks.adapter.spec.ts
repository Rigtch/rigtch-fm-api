import { Test } from '@nestjs/testing'

import { TracksAdapter } from './tracks.adapter'
import { PaginatedAdapter } from './paginated.adapter'
import { ArtistsAdapter } from './artists.adapter'

import {
  spotifyResponseWithCursorsMockFactory,
  spotifyResponseWithOffsetMockFactory,
  spotifyTrackMock,
  spotifyTracksMock,
  trackMock,
  tracksMock,
} from '@common/mocks'

describe('TracksAdapter', () => {
  let tracksAdapter: TracksAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TracksAdapter, PaginatedAdapter, ArtistsAdapter],
    }).compile()

    tracksAdapter = module.get(TracksAdapter)
  })

  test('should be defined', () => {
    expect(tracksAdapter).toBeDefined()
  })

  test('should adapt a single track', () => {
    expect(tracksAdapter.adapt(spotifyTrackMock)).toEqual(trackMock)
  })

  test('should adapt multiple tracks', () => {
    expect(tracksAdapter.adapt(spotifyTracksMock)).toEqual(tracksMock)
  })

  test('should adapt a paginated list of tracks', () => {
    expect(
      tracksAdapter.adapt(
        spotifyResponseWithOffsetMockFactory(spotifyTracksMock)
      )
    ).toEqual(spotifyResponseWithOffsetMockFactory(tracksMock))
  })

  test('should adapt recently played tracks page', () => {
    expect(
      tracksAdapter.adapt(
        spotifyResponseWithCursorsMockFactory(
          spotifyTracksMock.map(track => ({
            track,
            played_at: trackMock.playedAt!,
            context: {
              type: 'playlist',
              href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M',
              uri: 'spotify:user:spotify:playlist:37i9dQZF1DXcBWIGoYBM5M',
              external_urls: {
                spotify:
                  'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
              },
            },
          }))
        )
      )
    ).toEqual(spotifyResponseWithCursorsMockFactory(tracksMock))
  })
})
