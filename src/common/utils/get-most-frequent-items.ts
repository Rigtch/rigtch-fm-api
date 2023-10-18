export function getMostFrequentItems(array: string[], limit = 1) {
  console.log(array)

  if (array.length === 0) return array

  const frequencies = {}

  for (const item of array) {
    frequencies[item] =
      frequencies[item] === undefined ? 1 : frequencies[item] + 1
  }

  const frequencyArray = []

  for (const key in frequencies) {
    frequencyArray.push([frequencies[key], key])
  }

  frequencyArray.sort((a, b) => {
    return b[0] - a[0]
  })

  const mostFrequentItems = []

  for (let index = 0; index < limit; index++) {
    console.log(frequencyArray[index])
    frequencyArray[index] && mostFrequentItems.push(frequencyArray[index]?.[1])
  }

  console.log(mostFrequentItems)

  return mostFrequentItems
}
