import type { Album } from '@modules/items/albums'
import type { Artist } from '@modules/items/artists'
import type { Track } from '@modules/items/tracks'

export type TopItem<T extends Artist | Album | Track | string> =
  | ({
      item: T
    } & {
      playTime: number
      plays?: never
    })
  | {
      plays: number
      playTime?: never
    }
