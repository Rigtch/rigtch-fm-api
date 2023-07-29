import { spotifyPlaybackStateMock, formattedPlaybackStateMock } from '../mocks'

import { adaptPlaybackState } from './playback-state.adapter'

describe('adaptPlaybackState', () => {
  it('should adapt playback state', () => {
    expect(adaptPlaybackState(spotifyPlaybackStateMock)).toEqual(
      formattedPlaybackStateMock
    )
  })
})
