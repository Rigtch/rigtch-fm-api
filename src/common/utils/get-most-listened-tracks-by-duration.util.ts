import { chain, sumBy } from 'lodash'

import type { Track } from '@modules/items/tracks'

export function getMostListenedTracksByDuration(
  tracks: Pick<Track, 'id' | 'duration'>[],
  limit = 1
): string[] {
  if (tracks.length === 0) {
    return []
  }

  const trackDurations = chain(tracks)
    .groupBy('id')
    .map((groupedTracks, id) => ({
      id,
      duration: sumBy(groupedTracks, 'duration'),
      track: groupedTracks[0],
    }))
    .sortBy('duration')
    .reverse()
    .take(limit)
    .value()

  return trackDurations.map(item => item.track.id)
}
