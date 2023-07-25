import { ApiProperty } from '@nestjs/swagger'

import { ImageDto } from '.'

import { FormattedArtist, FormattedTrackArtist } from '~/common/types/spotify'

export abstract class Artist implements FormattedArtist {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty({ type: [String] })
  genres: string[]

  @ApiProperty()
  href: string

  @ApiProperty({ type: [ImageDto] })
  images: ImageDto[]
}

export abstract class TrackArtist implements FormattedTrackArtist {
  @ApiProperty()
  name: string

  @ApiProperty()
  id: string

  @ApiProperty()
  href: string
}
