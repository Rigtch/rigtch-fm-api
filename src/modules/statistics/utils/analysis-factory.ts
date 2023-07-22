import { audioFeaturesReducer } from './audio-features-reducer'

import { FormattedAudioFeatures } from '@common/types/spotify'
import { Analysis } from '@common/dtos'

export const analysisFactory = (
  audioFeatures: FormattedAudioFeatures[]
): Analysis => ({
  danceability:
    audioFeatures
      .map(({ danceability }) => danceability)
      .reduce(audioFeaturesReducer) / audioFeatures.length,
  acousticness:
    audioFeatures
      .map(({ acousticness }) => acousticness)
      .reduce(audioFeaturesReducer) / audioFeatures.length,
  instrumentalness:
    audioFeatures
      .map(({ instrumentalness }) => instrumentalness)
      .reduce(audioFeaturesReducer, 0) / audioFeatures.length,
  speechiness:
    audioFeatures
      .map(({ speechiness }) => speechiness)
      .reduce(audioFeaturesReducer) / audioFeatures.length,
  liveness:
    audioFeatures.map(({ liveness }) => liveness).reduce(audioFeaturesReducer) /
    audioFeatures.length,
  loudness:
    audioFeatures.map(({ loudness }) => loudness).reduce(audioFeaturesReducer) /
    audioFeatures.length,
  energy:
    audioFeatures.map(({ energy }) => energy).reduce(audioFeaturesReducer) /
    audioFeatures.length,
  tempo:
    audioFeatures.map(({ tempo }) => tempo).reduce(audioFeaturesReducer) /
    audioFeatures.length,
  mode:
    audioFeatures.map(({ mode }) => mode).reduce(audioFeaturesReducer) /
    audioFeatures.length,
  key:
    audioFeatures.map(({ key }) => key).reduce(audioFeaturesReducer) /
    audioFeatures.length,
  valence:
    audioFeatures.map(({ valence }) => valence).reduce(audioFeaturesReducer) /
    audioFeatures.length,
})
