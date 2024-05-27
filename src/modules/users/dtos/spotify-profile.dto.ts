import { ApiProperty } from '@nestjs/swagger'

import { Profile, SdkImage } from '@common/types/spotify'

export abstract class SpotifyProfile implements Profile {
  @ApiProperty({
    description: 'The Spotify user id.',
    example: '31cnbi3skdx5hv5onslik572r4la',
  })
  readonly id: string

  @ApiProperty({
    description: 'The Spotify user display name.',
    example: 'mng775',
  })
  readonly displayName: string

  readonly images?: SdkImage[]

  @ApiProperty({
    description: 'The number of followers the Spotify user has.',
    example: 0,
  })
  readonly followers: number

  @ApiProperty({
    description: 'The country of the Spotify user.',
    example: 'PL',
  })
  readonly country?: string

  @ApiProperty({
    description: 'The email of the Spotify user.',
    example: 'example.com',
  })
  readonly email?: string

  @ApiProperty({
    description: "The link to the user's Spotify account.",
    example: 'https://api.spotify.com/v1/users/31cnbi3skdx5hv5onslik572r4la',
  })
  readonly href: string

  @ApiProperty({
    description: `The user's Spotify subscription level: "premium", "free", etc. (The subscription level "open" can be considered the same as "free".)`,
    example: 'premium',
  })
  readonly product?: string

  @ApiProperty({
    description: 'The object type: "user"',
    example: 'user',
    deprecated: true,
  })
  readonly type: string

  @ApiProperty({
    description: 'The Spotify URI for the user.',
    example: 'spotify:user:31cnbi3skdx5hv5onslik572r4la',
    deprecated: true,
  })
  readonly uri: string
}
