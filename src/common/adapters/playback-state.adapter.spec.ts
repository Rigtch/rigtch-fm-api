import { Test } from '@nestjs/testing'

import { PlaybackStateAdapter } from './playback-state.adapter'
import { DevicesAdapter } from './devices.adapter'
import { TracksAdapter } from './tracks.adapter'
import { PaginatedAdapter } from './paginated.adapter'
import { ArtistsAdapter } from './artists.adapter'

import { playbackStateMock, spotifyPlaybackStateMock } from '@common/mocks'

describe('PlaybackStateAdapter', () => {
  let playbackStateAdapter: PlaybackStateAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PlaybackStateAdapter,
        DevicesAdapter,
        TracksAdapter,
        PaginatedAdapter,
        ArtistsAdapter,
      ],
    }).compile()

    playbackStateAdapter = module.get(PlaybackStateAdapter)
  })

  test('should be defined', () => {
    expect(playbackStateAdapter).toBeDefined()
  })

  test('should adapt a single playback state', () => {
    expect(playbackStateAdapter.adapt(spotifyPlaybackStateMock)).toEqual(
      playbackStateMock
    )
  })
})
