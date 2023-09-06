import { SpotifyResponseWithOffset } from '../types/spotify'

export const adaptPaginated = <T, D>(
  data: SpotifyResponseWithOffset<T>,
  adaptFunction: (items: T[]) => D[]
): SpotifyResponseWithOffset<D> => {
  const { items, next, href, limit, offset } = data

  return {
    offset,
    limit,
    next,
    href,
    items: adaptFunction(items),
  }
}
