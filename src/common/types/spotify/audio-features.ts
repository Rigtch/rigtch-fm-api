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

export { AudioFeatures as SdkAudioFeatures } from '@spotify/web-api-ts-sdk'
