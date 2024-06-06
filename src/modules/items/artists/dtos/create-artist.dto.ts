import { IsInt, IsOptional, IsString } from 'class-validator'

import type { Artist } from '../artist.entity'

import type { Image } from '@modules/items/images'
import type { CreateImage } from '@modules/items/images/dtos'
import type { SdkArtist } from '@common/types/spotify'

export abstract class Followers {
  @IsInt()
  total: number
}

export abstract class CreateArtist implements Omit<Artist, 'id' | 'type'> {
  @IsString()
  readonly externalId: string

  @IsString()
  readonly name: string

  @IsString()
  readonly href: string

  @IsString({ each: true })
  readonly genres: string[]

  @IsInt()
  readonly popularity: number

  readonly followers: number

  @IsOptional()
  readonly images: Image[]
}

export abstract class SdkCreateArtist
  implements Omit<SdkArtist, 'images' | 'followers' | 'href' | 'type' | 'uri'>
{
  @IsString()
  readonly id: string

  @IsString()
  readonly name: string

  @IsString()
  readonly external_urls: {
    readonly spotify: string
  }

  @IsString({ each: true })
  readonly genres: string[]

  @IsInt()
  readonly popularity: number

  readonly followers: Followers

  @IsOptional()
  readonly images: CreateImage[]
}
