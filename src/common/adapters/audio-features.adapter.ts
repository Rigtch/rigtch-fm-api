import { Injectable } from '@nestjs/common'

import { AudioFeatures, SdkAudioFeatures } from '@common/types/spotify'

@Injectable()
export class AudioFeaturesAdapter {
  public adapt(data: SdkAudioFeatures[]): AudioFeatures[]
  public adapt(data: SdkAudioFeatures): AudioFeatures

  adapt(data: SdkAudioFeatures | SdkAudioFeatures[]) {
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
  }: SdkAudioFeatures): AudioFeatures => ({
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
