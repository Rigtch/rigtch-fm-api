import { ApiProperty } from '@nestjs/swagger'

import { Album, TrackArtist } from '.'

import { FormattedTrack } from '~/common/types/spotify'

export abstract class Track implements FormattedTrack {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  href: string

  @ApiProperty({ type: [TrackArtist] })
  artists: TrackArtist[]

  @ApiProperty({ type: Album })
  album: Album

  @ApiProperty({ type: Number })
  duration: number

  @ApiProperty({ type: Number, required: false })
  progress?: number

  @ApiProperty({ required: false })
  playedAt?: string
}
