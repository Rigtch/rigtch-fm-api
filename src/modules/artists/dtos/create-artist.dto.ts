import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

import { Image } from '@modules/images'
import { CreateImage } from '@modules/images/dtos'

export abstract class CreateArtist {
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

  @IsInt()
  @ApiProperty({ type: Number })
  followers: number

  @IsOptional()
  @ApiProperty({ type: Image, isArray: true })
  images?: CreateImage[]
}
