export interface SpotifyAudioFeatures {
  acousticness: number
  analysis_url: string
  danceability: number
  duration_ms: number
  energy: number
  id: string
  instrumentalness: number
  key: number
  liveness: number
  loudness: number
  mode: number
  speechiness: number
  tempo: number
  time_signature: number
  track_href: string
  type: string
  uri: string
  valence: number
}

export interface AudioFeatures extends Analysis {
  id: string
  trackHref: string
}

export interface Analysis {
  danceability: number
  acousticness: number
  instrumentalness: number
  speechiness: number
  liveness: number
  loudness: number
  energy: number
  tempo: number
  mode: number
  key: number
  valence: number
}
