import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDate,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'
import { Page } from '@spotify/web-api-ts-sdk'

import { Album } from '../album.entity'

import { Artist } from '@modules/items/artists'
import { Track } from '@modules/items/tracks'
import {
  SdkAlbum,
  SdkArtist,
  SdkImage,
  SdkSimplifiedTrack,
} from '@common/types/spotify'
import { Image } from '@modules/items/images'

export abstract class CreateAlbum implements Omit<Album, 'id'> {
  @IsString()
  @ApiProperty()
  readonly externalId: string

  @IsString()
  @ApiProperty()
  readonly name: string

  @IsString()
  @ApiProperty()
  readonly albumType: string

  @IsInt()
  @ApiProperty({ type: Number })
  readonly totalTracks: number

  @IsString()
  @ApiProperty()
  readonly href: string

  @IsDate()
  @ApiProperty({ type: Date })
  readonly releaseDate: Date

  @IsArray()
  @ApiProperty({ type: Image, isArray: true })
  readonly images: Image[]

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
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
  readonly images: SdkImage[]

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
  readonly artists: SdkArtist[]

  @ApiProperty({ type: Track, isArray: true })
  readonly tracks: Page<SdkSimplifiedTrack>
}
