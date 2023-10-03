import { FormattedProfile, SpotifyProfile } from '../types/spotify'

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
}: SpotifyProfile): FormattedProfile => ({
  id,
  displayName: display_name,
  email,
  images,
  country,
  href,
  product,
  type,
  uri,
  followers: followers.total,
})
