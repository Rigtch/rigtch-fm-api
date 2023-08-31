import { SpotifyResponse } from '../types/spotify'

export const adaptPaginated = <T, D>(
  data: SpotifyResponse<T, true>,
  adaptFunction: (items: T[]) => D[]
): SpotifyResponse<D, true> => {
  const { items, next, href, limit, offset } = data

  return {
    offset,
    limit,
    next,
    href,
    items: adaptFunction(items),
  }
}
