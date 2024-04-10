import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInstance, IsInt, IsString } from 'class-validator'

import { Track } from '../track.entity'

import {
  SdkSimplifiedAlbum,
  SdkSimplifiedArtist,
  SdkTrack,
} from '@common/types/spotify'
import { Artist } from '@modules/artists'
import { Album } from '@modules/albums'

export abstract class CreateTrack implements Omit<Track, 'id'> {
  @IsString()
  @ApiProperty()
  readonly externalId: string

  @IsString()
  @ApiProperty()
  readonly name: string

  @IsString()
  @ApiProperty()
  readonly href: string

  @IsInt()
  @ApiProperty({ type: Number })
  readonly duration: number

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
  readonly artists: Artist[]

  @IsInstance(Album)
  @ApiProperty({ type: Album })
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
      | 'disc_number'
      | 'track_number'
      | 'explicit'
      | 'is_local'
      | 'type'
      | 'uri'
      | 'track'
      | 'episode'
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
  readonly external_urls: {
    readonly spotify: string
  }

  @IsInt()
  @ApiProperty({ type: Number })
  readonly duration_ms: number

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
  readonly artists: SdkSimplifiedArtist[]

  @ApiProperty()
  readonly album: SdkSimplifiedAlbum
}
