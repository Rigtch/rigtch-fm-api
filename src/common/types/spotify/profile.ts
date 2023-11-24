import { SpotifyImage } from './image'

export interface FormattedProfile {
  id: string
  displayName: string
  images?: SpotifyImage[]
  followers: number
  country?: string
  email?: string
  href: string
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
    href?: string
    total: number
  }
  href: string
  id: string
  images: SpotifyImage[]
  product?: string
  type: string
  uri: string
}
