import { countBy, entries, flow, head, last, maxBy, partialRight } from 'lodash'

export function getMostFrequentItems(array: string[], limit = 1) {
  const results: string[] = []

  while (results.length < limit) {
    const mostFrequentItem = flow(
      countBy,
      entries,
      partialRight(maxBy, last),
      head<string>
    )(array.filter(item => !results.includes(item)))

    if (mostFrequentItem) results.push(mostFrequentItem)
    else break
  }

  return results
}
