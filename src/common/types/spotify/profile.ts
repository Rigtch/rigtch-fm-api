import { SpotifyImage } from './image'

export interface Profile {
  id: string
  displayName: string
  images?: SpotifyImage[]
  followers: number
  country?: string
  email?: string
  href: string
  product?: string
  type: string
  uri: string
}

export interface SpotifyProfile {
  country?: string
  display_name?: string
  email?: string
  explicit_content?: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  external_urls: {
    spotify: string
  }
  followers: {
    href?: string | null
    total: number
  }
  href: string
  id: string
  images: SpotifyImage[]
  product?: string
  type: string
  uri: string
}
