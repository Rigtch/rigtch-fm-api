import { spotifyAudioFeaturesMock, audioFeaturesMock } from '../mocks'

import { adaptAudioFeatures } from './audio-features.adapter'

describe('adaptAudioFeatures', () => {
  test('should adapt audio features', () => {
    expect(adaptAudioFeatures(spotifyAudioFeaturesMock)).toEqual(
      audioFeaturesMock
    )
  })
})
