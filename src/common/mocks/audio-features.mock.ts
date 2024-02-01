import { AudioFeatures, SdkAudioFeatures, Analysis } from '../types/spotify'

export const sdkAudioFeaturesMock: SdkAudioFeatures = {
  acousticness: 0.016,
  analysis_url:
    'https://api.spotify.com/v1/audio-analysis/2JIRtFAIUkd86PQD12Hm7r',
  danceability: 0.267,
  duration_ms: 369_760,
  energy: 1,
  id: '2JIRtFAIUkd86PQD12Hm7r',
  instrumentalness: 0.447,
  key: 4,
  liveness: 0.45,
  loudness: -4.92,
  mode: 0,
  speechiness: 0.135,
  tempo: 138.616,
  time_signature: 4,
  track_href: 'https://api.spotify.com/v1/tracks/2JIRtFAIUkd86PQD12Hm7r',
  type: 'audio_features',
  uri: 'spotify:track:2JIRtFAIUkd86PQD12Hm7r',
  valence: 0.0215,
}

export const analysisMock: Analysis = {
  acousticness: sdkAudioFeaturesMock.acousticness,
  danceability: sdkAudioFeaturesMock.danceability,
  energy: sdkAudioFeaturesMock.energy,
  instrumentalness: sdkAudioFeaturesMock.instrumentalness,
  liveness: sdkAudioFeaturesMock.liveness,
  loudness: sdkAudioFeaturesMock.loudness,
  speechiness: sdkAudioFeaturesMock.speechiness,
  tempo: sdkAudioFeaturesMock.tempo,
  valence: sdkAudioFeaturesMock.valence,
  mode: sdkAudioFeaturesMock.mode,
  key: sdkAudioFeaturesMock.key,
}

export const audioFeaturesMock: AudioFeatures = {
  id: sdkAudioFeaturesMock.id,
  trackHref: sdkAudioFeaturesMock.track_href,
  ...analysisMock,
}
