import { getMostFrequentItems } from './get-most-frequent-items.util'

describe('GetMostFrequentItems', () => {
  test('should get most frequent item', () => {
    expect(getMostFrequentItems(['a', 'a', 'b', 'c', 'c', 'c'])).toEqual([
      {
        item: 'c',
        count: 3,
      },
    ])
  })

  test('should get most frequent items', () => {
    expect(getMostFrequentItems(['a', 'a', 'b', 'c', 'c', 'c'], 2)).toEqual([
      {
        item: 'c',
        count: 3,
      },
      {
        item: 'a',
        count: 2,
      },
    ])
  })

  test('should return an empty array, because there are no items', () => {
    expect(getMostFrequentItems([])).toEqual([])
  })

  test('should return first item, because there are no repeated items', () => {
    expect(getMostFrequentItems(['a', 'b', 'c'])).toEqual([
      {
        item: 'c',
        count: 1,
      },
    ])
  })
})
