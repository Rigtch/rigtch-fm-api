import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsInt,
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
      | 'external_urls'
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
  id: string

  @IsString()
  @ApiProperty()
  name: string

  @IsString()
  @ApiProperty()
  album_type: string

  @IsInt()
  @ApiProperty({ type: Number })
  total_tracks: number

  @IsString()
  @ApiProperty()
  href: string

  @IsDateString()
  @ApiProperty()
  release_date: string

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Image, isArray: true })
  images?: SdkImage[]

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
  artists: SdkArtist[]

  @ApiProperty({ type: Track, isArray: true })
  tracks: Page<SdkSimplifiedTrack>
}
