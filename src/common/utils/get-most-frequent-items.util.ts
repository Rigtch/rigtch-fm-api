import { countBy, entries, sortBy } from 'lodash'

interface FrequentItem {
  item: string
  count: number
}

export function getMostFrequentItems(
  array: string[],
  limit = 1
): FrequentItem[] {
  const itemCounts = countBy(array)

  const itemsWithCounts: FrequentItem[] = entries(itemCounts).map(
    ([item, count]) => ({
      item,
      count,
    })
  )

  return sortBy(itemsWithCounts, 'count').reverse().slice(0, limit)
}
