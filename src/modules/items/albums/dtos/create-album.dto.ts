import {
  IsArray,
  IsDate,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'
import type { Page } from '@spotify/web-api-ts-sdk'

import type { Album } from '../album.entity'

import type { Artist } from '@modules/items/artists'
import type {
  SdkAlbum,
  SdkArtist,
  SdkImage,
  SdkSimplifiedTrack,
} from '@common/types/spotify'
import type { Image } from '@modules/items/images'

export abstract class CreateAlbum implements Omit<Album, 'id'> {
  @IsString()
  readonly externalId: string

  @IsString()
  readonly name: string

  @IsString()
  readonly albumType: string

  @IsInt()
  readonly totalTracks: number

  @IsString()
  readonly href: string

  @IsDate()
  readonly releaseDate: Date

  @IsArray()
  readonly images: Image[]

  @IsArray()
  readonly artists: Artist[]
}

export abstract class SdkCreateAlbum
  implements
    Omit<
      SdkAlbum,
      | 'available_markets'
      | 'href'
      | 'copyrights'
      | 'external_ids'
      | 'genres'
      | 'label'
      | 'popularity'
      | 'release_date_precision'
      | 'type'
      | 'artists'
      | 'uri'
    >
{
  @IsString()
  readonly id: string

  @IsString()
  readonly name: string

  @IsString()
  readonly album_type: string

  @IsInt()
  readonly total_tracks: number

  @IsObject()
  readonly external_urls: {
    readonly spotify: string
  }

  @IsDateString()
  readonly release_date: string

  @IsOptional()
  @IsArray()
  readonly images: SdkImage[]

  @IsArray()
  readonly artists: SdkArtist[]

  readonly tracks: Page<SdkSimplifiedTrack>
}
