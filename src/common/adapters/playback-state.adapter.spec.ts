import { Test, TestingModule } from '@nestjs/testing'

import { PlaybackStateAdapter } from './playback-state.adapter'
import { DevicesAdapter } from './devices.adapter'
import { TracksAdapter } from './tracks.adapter'
import { PageAdapter } from './page.adapter'
import { ArtistsAdapter } from './artists.adapter'

import { playbackStateMock, sdkPlaybackStateMock } from '@common/mocks'

describe('PlaybackStateAdapter', () => {
  let moduleRef: TestingModule
  let playbackStateAdapter: PlaybackStateAdapter

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        PlaybackStateAdapter,
        DevicesAdapter,
        TracksAdapter,
        PageAdapter,
        ArtistsAdapter,
      ],
    }).compile()

    playbackStateAdapter = moduleRef.get(PlaybackStateAdapter)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(playbackStateAdapter).toBeDefined()
  })

  test('should adapt a single playback state', () => {
    expect(playbackStateAdapter.adapt(sdkPlaybackStateMock)).toEqual(
      playbackStateMock
    )
  })
})
