import { expect, test, describe } from 'vitest'

import { spotifyAudioFeaturesMock, formattedAudioFeaturesMock } from '../mocks'

import { adaptAudioFeatures } from './audio-features.adapter'

describe('adaptAudioFeatures', () => {
  test('should adapt audio features', () => {
    expect(adaptAudioFeatures(spotifyAudioFeaturesMock)).toEqual(
      formattedAudioFeaturesMock
    )
  })
})
