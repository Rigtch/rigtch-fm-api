export function getMostFrequentItems(array: string[], limit = 1) {
  if (array.length === 0) return array

  const frequencies = {}

  for (const item of array) {
    if (frequencies[item] === undefined) {
      frequencies[item] = 1
    } else {
      frequencies[item] = frequencies[item] + 1
    }
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
    mostFrequentItems.push(frequencyArray[index][1])
  }

  return mostFrequentItems
}
