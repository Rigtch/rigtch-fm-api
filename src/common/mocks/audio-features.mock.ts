import { FormattedAudioFeatures, SpotifyAudioFeatures } from '../types/spotify'

export const spotifyAudioFeaturesMock: SpotifyAudioFeatures = {
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

export const formattedAudioFeaturesMock: FormattedAudioFeatures = {
  acousticness: 0.016,
  danceability: 0.267,
  energy: 1,
  id: '2JIRtFAIUkd86PQD12Hm7r',
  instrumentalness: 0.447,
  key: 4,
  liveness: 0.45,
  loudness: -4.92,
  mode: 0,
  speechiness: 0.135,
  tempo: 138.616,
  trackHref: 'https://api.spotify.com/v1/tracks/2JIRtFAIUkd86PQD12Hm7r',
  valence: 0.0215,
}
