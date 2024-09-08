import { MockInstance } from 'vitest'

import { SdkTrack, SdkArtist } from '../spotify'

import { Track } from '@modules/items/tracks'
import { Artist } from '@modules/items/artists'

export type FindOrCreateTracksSpy = MockInstance<
  (tracks: SdkTrack[]) => Promise<Track[]>
>
export type FindOrCreateArtistsSpy = MockInstance<
  (artists: SdkArtist[]) => Promise<Artist[]>
>
