import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsString } from 'class-validator'

import {
  SdkAlbum,
  SdkArtist,
  SdkSimplifiedAlbum,
  SdkSimplifiedArtist,
  SimplifiedAlbum,
  SimplifiedArtist,
} from '@common/types/spotify'
import { Album } from '@modules/albums'
import { Artist } from '@modules/artists'

export abstract class CreateTrack {
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
  duration: number

  @ApiProperty({ type: Album })
  album: SdkAlbum | SdkSimplifiedAlbum | SimplifiedAlbum

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
  artists: (SdkArtist | SdkSimplifiedArtist | SimplifiedArtist)[]
}
