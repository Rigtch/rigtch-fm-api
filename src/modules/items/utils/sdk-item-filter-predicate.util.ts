import { Item } from '../types'

export function sdkItemFilterPredicate<TItems extends Item>(
  id: string,
  items: TItems[]
) {
  return !items.some(item => item.externalId === id)
}
