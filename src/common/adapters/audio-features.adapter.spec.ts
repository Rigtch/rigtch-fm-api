import { Test, TestingModule } from '@nestjs/testing'

import { AudioFeaturesAdapter } from './audio-features.adapter'

import { audioFeaturesMock, sdkAudioFeaturesMock } from '@common/mocks'

describe('AudioFeaturesAdapter', () => {
  let moduleRef: TestingModule
  let audioFeaturesAdapter: AudioFeaturesAdapter

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [AudioFeaturesAdapter],
    }).compile()

    audioFeaturesAdapter = moduleRef.get(AudioFeaturesAdapter)
  })

  afterEach(() => {
    moduleRef.close()
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
