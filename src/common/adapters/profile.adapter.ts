import { Profile, SpotifyProfile } from '../types/spotify'

export const adaptProfile = ({
  id,
  display_name,
  email,
  images,
  country,
  product,
  type,
  uri,
  external_urls: { spotify: href },
  followers,
}: SpotifyProfile): Profile => ({
  id,
  displayName: display_name ?? id,
  email,
  images,
  country,
  href,
  product,
  type,
  uri,
  followers: followers.total,
})
