import { chain, sumBy } from 'lodash'

import type { Track } from '@modules/items/tracks'

interface MostListenedItem {
  id: string
  totalDuration: number
}

export function getMostListenedItemsByDuration(
  tracks: Pick<Track, 'id' | 'duration'>[],
  limit = 1
): MostListenedItem[] {
  if (tracks.length === 0) {
    return []
  }

  return chain(tracks)
    .groupBy('id')
    .map((groupedTracks, id) => ({
      id,
      totalDuration: sumBy(groupedTracks, 'duration'),
    }))
    .sortBy('totalDuration')
    .reverse()
    .take(limit)
    .value()
}
