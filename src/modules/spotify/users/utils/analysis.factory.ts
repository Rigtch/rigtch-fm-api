import { audioFeaturesReducer } from './audio-features.reducer'

import { AudioFeatures, Analysis } from '@common/types/spotify'

export const analysisFactory = (audioFeatures: AudioFeatures[]): Analysis => ({
  danceability:
    audioFeatures
      .map(({ danceability }) => danceability)
      .reduce(audioFeaturesReducer, 0) / audioFeatures.length,
  acousticness:
    audioFeatures
      .map(({ acousticness }) => acousticness)
      .reduce(audioFeaturesReducer, 0) / audioFeatures.length,
  instrumentalness:
    audioFeatures
      .map(({ instrumentalness }) => instrumentalness)
      .reduce(audioFeaturesReducer, 0) / audioFeatures.length,
  speechiness:
    audioFeatures
      .map(({ speechiness }) => speechiness)
      .reduce(audioFeaturesReducer, 0) / audioFeatures.length,
  liveness:
    audioFeatures
      .map(({ liveness }) => liveness)
      .reduce(audioFeaturesReducer, 0) / audioFeatures.length,
  loudness:
    audioFeatures
      .map(({ loudness }) => loudness)
      .reduce(audioFeaturesReducer, 0) / audioFeatures.length,
  energy:
    audioFeatures.map(({ energy }) => energy).reduce(audioFeaturesReducer, 0) /
    audioFeatures.length,
  tempo:
    audioFeatures.map(({ tempo }) => tempo).reduce(audioFeaturesReducer, 0) /
    audioFeatures.length,
  mode:
    audioFeatures.map(({ mode }) => mode).reduce(audioFeaturesReducer, 0) /
    audioFeatures.length,
  key:
    audioFeatures.map(({ key }) => key).reduce(audioFeaturesReducer, 0) /
    audioFeatures.length,
  valence:
    audioFeatures
      .map(({ valence }) => valence)
      .reduce(audioFeaturesReducer, 0) / audioFeatures.length,
})
