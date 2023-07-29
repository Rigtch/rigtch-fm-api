import { FormattedProfile, SpotifyProfile } from '../types/spotify'

export const adaptProfile = ({
  id,
  display_name,
  email,
  images,
  country,
  external_urls: { spotify: href },
  followers,
}: SpotifyProfile): FormattedProfile => ({
  id,
  displayName: display_name,
  email,
  images,
  country,
  href,
  followers: followers.total,
})
