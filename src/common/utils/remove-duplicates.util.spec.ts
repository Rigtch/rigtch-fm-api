import { removeDuplicates } from './remove-duplicates.util'

describe('removeDuplicates', () => {
  test('should remove duplicates', () => {
    const arrayWithDuplicates = [1, 2, 3, 3, 4, 5, 5, 5, 6]
    const expectedArray = [1, 2, 3, 4, 5, 6]

    expect(removeDuplicates(arrayWithDuplicates)).toEqual(expectedArray)
  })

  test('should not remove duplicates because there is no any', () => {
    const expectedArray = [1, 2, 3, 4, 5, 6]

    expect(removeDuplicates(expectedArray)).toEqual(expectedArray)
  })
})
