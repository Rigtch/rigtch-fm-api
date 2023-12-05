import { test, describe, expect } from 'vitest'

import { spotifyPlaybackStateMock, playbackStateMock } from '../mocks'

import { adaptPlaybackState } from './playback-state.adapter'

describe('adaptPlaybackState', () => {
  test('should adapt playback state', () => {
    expect(adaptPlaybackState(spotifyPlaybackStateMock)).toEqual(
      playbackStateMock
    )
  })
})
