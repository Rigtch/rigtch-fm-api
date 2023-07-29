import { spotifyAudioFeaturesMock, formattedAudioFeaturesMock } from '../mocks'

import { adaptAudioFeatures } from './audio-features.adapter'

describe('adaptAudioFeatures', () => {
  it('should adapt audio features', () => {
    expect(adaptAudioFeatures(spotifyAudioFeaturesMock)).toEqual(
      formattedAudioFeaturesMock
    )
  })
})
