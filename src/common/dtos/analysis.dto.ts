import { ApiProperty } from '@nestjs/swagger'

import { FormattedAudioFeatures } from '../types/spotify'

export abstract class Analysis
  implements Omit<FormattedAudioFeatures, 'id' | 'trackHref'>
{
  @ApiProperty({ type: Number })
  danceability: number

  @ApiProperty({ type: Number })
  acousticness: number

  @ApiProperty({ type: Number })
  instrumentalness: number

  @ApiProperty({ type: Number })
  speechiness: number

  @ApiProperty({ type: Number })
  liveness: number

  @ApiProperty({ type: Number })
  loudness: number

  @ApiProperty({ type: Number })
  energy: number

  @ApiProperty({ type: Number })
  tempo: number

  @ApiProperty({ type: Number })
  mode: number

  @ApiProperty({ type: Number })
  key: number

  @ApiProperty({ type: Number })
  valence: number
}
