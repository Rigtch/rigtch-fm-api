import { SpotifyResponseWithOffset } from '../types/spotify'

export const adaptPaginated = <TItems, TAdaptedItems>(
  data: SpotifyResponseWithOffset<TItems>,
  adaptFunction: (items: TItems[]) => TAdaptedItems[]
): SpotifyResponseWithOffset<TAdaptedItems> => {
  const { items, next, href, limit, offset } = data

  return {
    offset,
    limit,
    next,
    href,
    items: adaptFunction(items),
    total: items.length,
  }
}
