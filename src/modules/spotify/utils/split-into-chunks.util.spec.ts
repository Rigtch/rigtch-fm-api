import { splitIntoChunks } from './split-into-chunks.util'

describe('splitIntoChunks', () => {
  test('should split an array into chunks', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const chunkSize = 3

    const chunks = splitIntoChunks(array, chunkSize)

    expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
  })

  test('should not split an array into chunks if it is smaller than the chunk size', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const chunkSize = 10

    const chunks = splitIntoChunks(array, chunkSize)

    expect(chunks).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]])
  })
})
