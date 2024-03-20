import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsString } from 'class-validator'

import { SdkSimplifiedArtist, SdkTrack } from '@common/types/spotify'
import { Artist } from '@modules/artists'

export abstract class CreateTrack
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
      | 'album'
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
}
