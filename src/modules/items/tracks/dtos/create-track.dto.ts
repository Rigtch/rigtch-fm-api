import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator'

import { Track } from '../track.entity'

import { SdkSimplifiedArtist, SdkTrack } from '@common/types/spotify'
import { Artist } from '@modules/items/artists'
import type { Album } from '@modules/items/albums'
import type { SdkCreateAlbum } from '@modules/items/albums/dtos'

export abstract class CreateTrack implements Omit<Track, 'id' | 'type'> {
  @IsString()
  readonly externalId: string

  @IsString()
  readonly name: string

  @IsString()
  readonly href: string

  @IsInt()
  readonly duration: number

  @IsInt()
  readonly trackNumber: number

  @IsInt()
  readonly discNumber: number

  @IsBoolean()
  readonly explicit: boolean

  @IsArray()
  readonly artists: Artist[]

  readonly album: Album
}

export abstract class SdkCreateTrack
  implements
    Omit<
      SdkTrack,
      | 'images'
      | 'external_ids'
      | 'href'
      | 'available_markets'
      | 'preview_url'
      | 'is_local'
      | 'type'
      | 'popularity'
      | 'uri'
      | 'track'
      | 'episode'
      | 'album'
    >
{
  @IsString()
  readonly id: string

  @IsString()
  readonly name: string

  @IsString()
  readonly external_urls: {
    readonly spotify: string
  }

  @IsInt()
  readonly duration_ms: number

  @IsInt()
  readonly track_number: number

  @IsInt()
  readonly disc_number: number

  @IsBoolean()
  readonly explicit: boolean

  @IsArray()
  readonly artists: SdkSimplifiedArtist[]

  readonly album: SdkCreateAlbum
}
