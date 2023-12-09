import { getMostFrequentItems } from '.'

describe('GetMostFrequentItems', () => {
  test('should get most frequent item', () => {
    expect(getMostFrequentItems(['a', 'a', 'b', 'c', 'c', 'c'])).toEqual(['c'])
  })

  test('should get most frequent items', () => {
    expect(getMostFrequentItems(['a', 'a', 'b', 'c', 'c', 'c'], 2)).toEqual([
      'c',
      'a',
    ])
  })

  test('should return an empty array, because there are no items', () => {
    expect(getMostFrequentItems([])).toEqual([])
  })

  test('should return first item, because there are no repeated items', () => {
    expect(getMostFrequentItems(['a', 'b', 'c'])).toEqual(['a'])
  })
})
