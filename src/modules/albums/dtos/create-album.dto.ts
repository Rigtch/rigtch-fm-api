import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator'

import { SdkImage, SimplifiedArtist } from '@common/types/spotify'
import { Artist } from '@modules/artists'

export abstract class CreateAlbum {
  @IsString()
  @ApiProperty()
  id: string

  @IsString()
  @ApiProperty()
  name: string

  @IsInt()
  @ApiProperty({ type: Number })
  totalTracks: number

  @IsString()
  @ApiProperty()
  href: string

  @IsDateString()
  @ApiProperty()
  releaseDate: string

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Image, isArray: true })
  images?: SdkImage[]

  @IsArray()
  @ApiProperty({ type: Artist, isArray: true })
  artists: SimplifiedArtist[]
}
