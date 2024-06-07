import { audioFeaturesReducer } from './audio-features.reducer'

describe('audioFeaturesReducer', () => {
  it('should return the sum of the values', () => {
    expect(audioFeaturesReducer(1, 2)).toEqual(3)
  })
})
