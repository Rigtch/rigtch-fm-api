import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

import { Image } from '@modules/images'
import { CreateImage } from '@modules/images/dtos'
import { SdkArtist } from '@common/types/spotify'

export abstract class Followers {
  @IsInt()
  @ApiProperty({ type: Number })
  total: number
}

export abstract class CreateArtist
  implements
    Omit<SdkArtist, 'images' | 'followers' | 'external_urls' | 'type' | 'uri'>
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

  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  genres: string[]

  @IsInt()
  @ApiProperty({ type: Number })
  popularity: number

  @ApiProperty({ type: Followers })
  followers: Followers

  @IsOptional()
  @ApiProperty({ type: Image, isArray: true })
  images?: CreateImage[]
}
