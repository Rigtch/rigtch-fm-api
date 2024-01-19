import { Injectable } from '@nestjs/common'
import { AudioFeatures as SpotifyAudioFeatures } from '@spotify/web-api-ts-sdk'

import { AudioFeatures } from '@common/types/spotify'

@Injectable()
export class AudioFeaturesAdapter {
  public adapt(data: SpotifyAudioFeatures[]): AudioFeatures[]
  public adapt(data: SpotifyAudioFeatures): AudioFeatures

  adapt(data: SpotifyAudioFeatures | SpotifyAudioFeatures[]) {
    if (Array.isArray(data))
      return data.map(audioFeatures => this.adaptAudioFeatures(audioFeatures))

    return this.adaptAudioFeatures(data)
  }

  adaptAudioFeatures = ({
    id,
    track_href,
    danceability,
    acousticness,
    instrumentalness,
    speechiness,
    liveness,
    loudness,
    energy,
    tempo,
    mode,
    key,
    valence,
  }: SpotifyAudioFeatures): AudioFeatures => ({
    id,
    trackHref: track_href,
    danceability,
    acousticness,
    instrumentalness,
    speechiness,
    liveness,
    loudness,
    energy,
    tempo,
    mode,
    key,
    valence,
  })
}
