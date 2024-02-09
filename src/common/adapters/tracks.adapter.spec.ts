import { Test } from '@nestjs/testing'

import { TracksAdapter } from './tracks.adapter'
import { PageAdapter } from './page.adapter'
import { ArtistsAdapter } from './artists.adapter'

import {
  recentlyPlayedTracksPageMockFactory,
  pageMockFactory,
  sdkTrackMock,
  sdkTracksMock,
  trackMock,
  tracksMock,
  sdkSimplifiedTrackMock,
  simplifiedTrackMock,
  simplifiedTracksMock,
  sdkSimplifiedTracksMock,
} from '@common/mocks'

describe('TracksAdapter', () => {
  let tracksAdapter: TracksAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TracksAdapter, PageAdapter, ArtistsAdapter],
    }).compile()

    tracksAdapter = module.get(TracksAdapter)
  })

  test('should be defined', () => {
    expect(tracksAdapter).toBeDefined()
  })

  test('should adapt a single track', () => {
    expect(tracksAdapter.adapt(sdkTrackMock)).toEqual(trackMock)
  })

  test('should adapt multiple tracks', () => {
    expect(tracksAdapter.adapt(sdkTracksMock)).toEqual(tracksMock)
  })

  test('should adapt simplified track', () => {
    expect(tracksAdapter.adapt(sdkSimplifiedTrackMock)).toEqual(
      simplifiedTrackMock
    )
  })

  test('should adapt multiple simplified tracks', () => {
    expect(tracksAdapter.adapt(sdkSimplifiedTracksMock)).toEqual(
      simplifiedTracksMock
    )
  })

  test('should adapt a paginated list of tracks', () => {
    expect(tracksAdapter.adapt(pageMockFactory(sdkTracksMock))).toEqual(
      pageMockFactory(tracksMock)
    )
  })

  test('should adapt recently played tracks page', () => {
    expect(
      tracksAdapter.adapt(
        recentlyPlayedTracksPageMockFactory(
          sdkTracksMock.map(track => ({
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
    ).toEqual(recentlyPlayedTracksPageMockFactory(tracksMock))
  })
})
