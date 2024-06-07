export function splitIntoChunks<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []

  if (array.length > chunkSize)
    for (let index = 0; index < array.length; index += chunkSize) {
      chunks.push(array.slice(index, index + chunkSize))
    }
  else chunks.push(array)

  return chunks
}
