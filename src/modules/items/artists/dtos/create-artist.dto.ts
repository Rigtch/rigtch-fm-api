import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

import { Artist } from '../artist.entity'

import { Image } from '@modules/images'
import { CreateImage } from '@modules/images/dtos'
import { SdkArtist } from '@common/types/spotify'

export abstract class Followers {
  @IsInt()
  @ApiProperty({ type: Number, nullable: true })
  total: number
}

export abstract class CreateArtist implements Omit<Artist, 'id'> {
  @IsString()
  @ApiProperty()
  readonly externalId: string

  @IsString()
  @ApiProperty()
  readonly name: string

  @IsString()
  @ApiProperty()
  readonly href: string

  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  readonly genres: string[]

  @IsInt()
  @ApiProperty({ type: Number })
  readonly popularity: number

  @ApiProperty({ type: Number })
  readonly followers: number

  @IsOptional()
  @ApiProperty({ type: Image, isArray: true })
  readonly images: Image[]
}

export abstract class SdkCreateArtist
  implements Omit<SdkArtist, 'images' | 'followers' | 'href' | 'type' | 'uri'>
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

  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  readonly genres: string[]

  @IsInt()
  @ApiProperty({ type: Number })
  readonly popularity: number

  @ApiProperty({ type: Followers })
  readonly followers: Followers

  @IsOptional()
  @ApiProperty({ type: Image, isArray: true })
  readonly images: CreateImage[]
}
