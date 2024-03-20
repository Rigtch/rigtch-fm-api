import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'
import { Page } from '@spotify/web-api-ts-sdk'

import {
  SdkAlbum,
  SdkArtist,
  SdkImage,
  SdkSimplifiedTrack,
} from '@common/types/spotify'
import { Artist } from '@modules/artists'
import { Image } from '@modules/images'
import { Track } from '@modules/tracks'

export abstract class CreateAlbum
  implements
    Omit<
      SdkAlbum,
      | 'images'
      | 'available_markets'
      | 'href'
      | 'copyrights'
      | 'external_ids'
      | 'genres'
      | 'label'
      | 'popularity'
      | 'release_date_precision'
      | 'type'
      | 'uri'
    >
{
  @IsString()
  @ApiProperty()
  readonly id: string

  @IsString()
  @ApiProperty()
  readonly name: string

  @IsString()
  @ApiProperty()
  readonly album_type: string

  @IsInt()
  @ApiProperty({ type: Number })
  readonly total_tracks: number

  @ApiProperty()
  @IsObject()
  readonly external_urls: {
    readonly spotify: string
  }

  @IsDateString()
  @ApiProperty()
  readonly release_date: string

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Image, isArray: true })
  readonly images?: SdkImage[]

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
  readonly artists: SdkArtist[]

  @ApiProperty({ type: Track, isArray: true })
  readonly tracks: Page<SdkSimplifiedTrack>
}
