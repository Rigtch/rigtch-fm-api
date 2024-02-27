import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsString } from 'class-validator'

import { SdkSimplifiedArtist, SdkTrack } from '@common/types/spotify'
import { Artist } from '@modules/artists'

export abstract class CreateTrack
  implements
    Omit<
      SdkTrack,
      | 'images'
      | 'external_urls'
      | 'external_ids'
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
  id: string

  @IsString()
  @ApiProperty()
  name: string

  @IsString()
  @ApiProperty()
  href: string

  @IsInt()
  @ApiProperty({ type: Number })
  duration_ms: number

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
  artists: SdkSimplifiedArtist[]
}
