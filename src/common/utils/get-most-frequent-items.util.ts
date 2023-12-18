export function getMostFrequentItems(array: string[], limit = 1) {
  if (array.length === 0) return array

  const frequencies = {}

  for (const item of array) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    frequencies[item] =
      frequencies[item] === undefined ? 1 : frequencies[item] + 1
  }

  const frequencyArray = []

  for (const key in frequencies) {
    frequencyArray.push([frequencies[key], key] as never)
  }

  frequencyArray.sort((a, b) => {
    return b[0] - a[0]
  })

  const mostFrequentItems = []

  for (let index = 0; index < limit; index++) {
    frequencyArray[index] && mostFrequentItems.push(frequencyArray[index]?.[1])
  }

  return mostFrequentItems
}
