import { Test } from '@nestjs/testing'

import { AudioFeaturesAdapter } from './audio-features.adapter'

import { audioFeaturesMock, sdkAudioFeaturesMock } from '@common/mocks'

describe('AudioFeaturesAdapter', () => {
  let audioFeaturesAdapter: AudioFeaturesAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AudioFeaturesAdapter],
    }).compile()

    audioFeaturesAdapter = module.get(AudioFeaturesAdapter)
  })

  test('should be defined', () => {
    expect(audioFeaturesAdapter).toBeDefined()
  })

  test('should adapt a single audio feature', () => {
    expect(audioFeaturesAdapter.adapt(sdkAudioFeaturesMock)).toEqual(
      audioFeaturesMock
    )
  })

  test('should adapt an array of audio features', () => {
    expect(audioFeaturesAdapter.adapt([sdkAudioFeaturesMock])).toEqual([
      audioFeaturesMock,
    ])
  })
})
