import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

import { Album, TrackArtist } from '.'

import { FormattedTrack } from '~/common/types/spotify'

@ObjectType()
export abstract class Track implements FormattedTrack {
  @Field(() => String)
  @ApiProperty()
  name: string

  @Field(() => String)
  @ApiProperty()
  href: string

  @Field(() => [TrackArtist])
  @ApiProperty({ type: [TrackArtist] })
  artists: TrackArtist[]

  @Field(() => Album)
  @ApiProperty({ type: Album })
  album: Album

  @Field(() => Number)
  @ApiProperty({ type: Number })
  duration: number

  @Field(() => Number, { nullable: true })
  @ApiProperty({ type: Number, required: false })
  progress?: number

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  playedAt?: string
}
