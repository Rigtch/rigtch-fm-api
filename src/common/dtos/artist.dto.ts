import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

import { ImageDto } from '.'

import { FormattedArtist, FormattedTrackArtist } from '~/common/types/spotify'

@ObjectType()
export abstract class Artist implements FormattedArtist {
  @Field(() => String)
  @ApiProperty()
  id: string

  @Field(() => String)
  @ApiProperty()
  name: string

  @Field(() => [String])
  @ApiProperty({ type: [String] })
  genres: string[]

  @Field(() => String)
  @ApiProperty()
  href: string

  @Field(() => [ImageDto])
  @ApiProperty({ type: [ImageDto] })
  images: ImageDto[]
}

@ObjectType()
export abstract class TrackArtist implements FormattedTrackArtist {
  @Field(() => String)
  @ApiProperty()
  name: string

  @Field(() => String)
  @ApiProperty()
  id: string

  @Field(() => String)
  @ApiProperty()
  href: string
}
