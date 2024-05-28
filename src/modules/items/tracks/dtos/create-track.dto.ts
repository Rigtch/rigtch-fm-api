import { IsArray, IsInt, IsString } from 'class-validator'

import { Track } from '../track.entity'

import { SdkSimplifiedArtist, SdkTrack } from '@common/types/spotify'
import { Artist } from '@modules/items/artists'
import type { Album } from '@modules/items/albums'
import type { SdkCreateAlbum } from '@modules/items/albums/dtos'

export abstract class CreateTrack implements Omit<Track, 'id'> {
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
      | 'popularity'
      | 'available_markets'
      | 'preview_url'
      | 'explicit'
      | 'is_local'
      | 'type'
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

  @IsArray()
  readonly artists: SdkSimplifiedArtist[]

  readonly album: SdkCreateAlbum
}
