import { analysisFactory } from './analysis.factory'

import { analysisMock, audioFeaturesMock } from '@common/mocks'

describe('analysisFactory', () => {
  it('should return an analysis page', () => {
    expect(analysisFactory([audioFeaturesMock])).toEqual(analysisMock)
  })
})
